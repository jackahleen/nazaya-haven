import { Anthropic } from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { nazayaSystemPrompt } from "@/lib/ai/nazaya-system-prompt";
import { routeNazayaIntent } from "@/lib/ai/intent-router";
import {
  getOrCreateSessionContext,
  appendSessionMessage,
} from "@/lib/memory/agent-memory";
import { buildCrossContext, recordChatTurn } from "@/lib/memory/cross-context";
import { storeMemoryTurn } from "@/lib/memory/long-term-memory";
import { embedText } from "@/lib/embeddings/factory";
import { getSessionIdFromRequest } from "@/lib/memory/session-utils";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, sessionId: clientSessionId, userId } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid request: messages array required" },
        { status: 400 }
      );
    }

    // Derive or generate session ID
    const sessionId = clientSessionId || (await getSessionIdFromRequest(request)) || "session-unknown";

    // Load session context
    const sessionContext = await getOrCreateSessionContext(sessionId, userId);

    // Derive intent from the last user message
    const lastUserMessage =
      [...messages]
        .reverse()
        .find((msg: { role: string }) => msg.role === "user")?.content ?? "";
    const intent = routeNazayaIntent(lastUserMessage);

    // Build cross-context from other services (resources, voice, dispatch)
    const crossContext = await buildCrossContext(sessionId);

    // Combine system prompt with cross-context
    const enhancedSystemPrompt = `${nazayaSystemPrompt}

Detected intent: ${intent}. Use that intent to organize the response.

Context from user's recent interactions:
${crossContext || "(No prior context)"}

Remember to keep responses focused on the detected intent and reference any prior context naturally.`;

    // Call Anthropic API with conversation history
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: enhancedSystemPrompt,
      messages: messages.map((msg: { role: string; content: string }) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
    });

    // Extract the text response
    const assistantMessage =
      response.content[0].type === "text" ? response.content[0].text : "";

    // Record chat turn to event log
    await recordChatTurn(sessionId, "user", lastUserMessage);
    await recordChatTurn(sessionId, "assistant", assistantMessage);

    // Append to session working memory
    const messageId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    await appendSessionMessage(sessionId, {
      id: messageId,
      role: "user",
      content: lastUserMessage,
      timestamp: Date.now(),
      lane: "chat",
    });

    await appendSessionMessage(sessionId, {
      id: `${messageId}-resp`,
      role: "assistant",
      content: assistantMessage,
      timestamp: Date.now(),
      lane: "chat",
    });

    // Store message summary in long-term memory (async)
    if (sessionContext.userId) {
      setImmediate(async () => {
        try {
          const embedding = await embedText(lastUserMessage);
          await storeMemoryTurn(sessionContext.userId!, {
            sessionId,
            turnNumber: sessionContext.messages.length + 1,
            lane: "chat",
            content: `User: "${lastUserMessage.slice(0, 500)}"`,
            contentEmbedding: embedding,
            entities: { intent },
            timestamp: Date.now(),
          });
        } catch (e) {
          console.error("Failed to store memory turn:", e);
        }
      });
    }

    return NextResponse.json({
      role: "assistant",
      content: assistantMessage,
      sessionId,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process chat request" },
      { status: 500 }
    );
  }
}

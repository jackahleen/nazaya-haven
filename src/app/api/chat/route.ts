import { Anthropic } from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { nazayaSystemPrompt } from "@/lib/ai/nazaya-system-prompt";
import { routeNazayaIntent } from "@/lib/ai/intent-router";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid request: messages array required" },
        { status: 400 }
      );
    }

    // Do not cache raw caregiver chat transcripts. Cache only normalized
    // intent metadata or explicit agent trace summaries.

    // Derive intent from the last user message
    const lastUserMessage =
      [...messages]
        .reverse()
        .find((msg: { role: string }) => msg.role === "user")?.content ?? "";
    const intent = routeNazayaIntent(lastUserMessage);

    // Call Anthropic API with conversation history
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: `${nazayaSystemPrompt}\n\nDetected intent: ${intent}. Use that intent to organize the response, but do not mention internal routing unless it helps the caregiver.`,
      messages: messages.map((msg: { role: string; content: string }) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
    });

    // Extract the text response
    const assistantMessage =
      response.content[0].type === "text" ? response.content[0].text : "";

    return NextResponse.json({
      role: "assistant",
      content: assistantMessage,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process chat request" },
      { status: 500 }
    );
  }
}

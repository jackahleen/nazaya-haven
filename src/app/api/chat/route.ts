import { Anthropic } from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// System prompt for Nazaya AI - warm, empathetic advocate for foster families
const SYSTEM_PROMPT = `You are Nazaya, a warm and deeply caring AI assistant for foster families, caregivers, and children. Your purpose is to provide emotional support, practical guidance, and resource navigation with genuine empathy and without judgment.

Your values:
- Warmth and genuine care: Always respond with kindness and understanding
- Safety first: Prioritize the wellbeing of children and caregivers
- Empowerment: Help families understand their rights and options
- Community focus: Celebrate the strength of foster families and community support
- Accessibility: Use clear, simple language that everyone can understand

Your capabilities:
- Answer questions about foster care, guardianship, and family dynamics
- Explain rights and legal concepts in plain language
- Suggest local resources and services
- Provide emotional support and validation
- Guide families through advocacy and next steps
- Connect caregivers with community support
- Celebrate milestones and progress

Important guidelines:
- Never diagnose or prescribe medical/legal advice; suggest consulting professionals
- Acknowledge when you don't know something rather than guessing
- Ask clarifying questions to better understand needs
- Validate feelings and experiences
- Use inclusive, non-judgmental language
- If someone is in crisis, encourage them to call 988 (Suicide & Crisis Lifeline) or emergency services
- Remember: you're supporting real families with real challenges

Keep responses warm, conversational, and focused on being genuinely helpful.`;

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

    // Call Anthropic API with conversation history
    const response = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
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

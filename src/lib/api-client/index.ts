import {
  type CommunityResourceCategory,
  type CommunityResourceResults,
  findStaticCommunityResources,
} from "@/data/community-resources";
import { getDemoNazayaChatResponse } from "@/lib/ai/demo-chat";
import { isStaticNazayaRuntime } from "@/lib/runtime/nazaya-runtime";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type ChatRequest = {
  messages: ChatMessage[];
};

export type ChatResponse = {
  content: string;
};

export type ResourceSearchInput = {
  zip: string;
  categories: readonly CommunityResourceCategory[];
};

/**
 * Send a chat request to the API.
 *
 * In static/demo mode (or on 404), returns demo data without throwing.
 * In hosted mode, calls POST /api/chat and propagates errors.
 */
export async function sendChat(request: ChatRequest): Promise<ChatResponse> {
  const isDemoMode = isStaticNazayaRuntime();

  if (isDemoMode) {
    // Demo mode: extract the last user message and generate a canned response
    const lastUserMessage = [...request.messages]
      .reverse()
      .find((msg) => msg.role === "user");

    if (!lastUserMessage) {
      return { content: "No user message provided" };
    }

    return {
      content: getDemoNazayaChatResponse(lastUserMessage.content),
    };
  }

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(
        `API error: ${response.status} ${response.statusText}`
      );
    }

    const data: ChatResponse = await response.json();
    return data;
  } catch (err) {
    // On error, fall back to demo mode
    const lastUserMessage = [...request.messages]
      .reverse()
      .find((msg) => msg.role === "user");

    if (!lastUserMessage) {
      throw err;
    }

    return {
      content: getDemoNazayaChatResponse(lastUserMessage.content),
    };
  }
}

/**
 * Search for community resources.
 *
 * In static/demo mode (or on 404), returns demo data without throwing.
 * In hosted mode, calls POST /api/resources and propagates errors.
 */
export async function searchResources(
  input: ResourceSearchInput
): Promise<CommunityResourceResults> {
  const isDemoMode = isStaticNazayaRuntime();

  if (isDemoMode) {
    return findStaticCommunityResources({
      zip: input.zip,
      categories: input.categories,
    });
  }

  try {
    const response = await fetch("/api/resources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        typeof data.error === "string"
          ? data.error
          : "Live resource search is unavailable."
      );
    }

    return data as CommunityResourceResults;
  } catch {
    // On error, fall back to demo mode
    return findStaticCommunityResources({
      zip: input.zip,
      categories: input.categories,
    });
  }
}

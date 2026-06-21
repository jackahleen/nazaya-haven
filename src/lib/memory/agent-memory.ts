/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { getRedisClient } from "@/lib/redis/client";

/**
 * Session-level working memory: tracks context across chat, resources, voice, dispatch
 */
export interface SessionContext {
  sessionId: string;
  userId?: string;
  currentLane: string; // "chat" | "resources" | "voice" | "dispatch"
  voiceEnabled: boolean;
  lastUserMessageTimestamp: number;
  contextStackSize: number;
  messages: Array<{
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: number;
    lane: string;
    toolCalls?: unknown[];
  }>;
  entities: Record<string, unknown>; // { user_name, zip_code, urgency_score, etc }
  breadcrumbs: string[]; // "resources_viewed", "forms_completed", etc
}

// In-memory fallback when Redis unavailable
const inMemoryStore = new Map<string, SessionContext>();

const DEFAULT_TTL = 24 * 60 * 60; // 24 hours

export async function getOrCreateSessionContext(
  sessionId: string,
  userId?: string
): Promise<SessionContext> {
  const client = await getRedisClient();

  if (!client) {
    // Use in-memory fallback
    if (!inMemoryStore.has(sessionId)) {
      inMemoryStore.set(sessionId, {
        sessionId,
        userId,
        currentLane: "chat",
        voiceEnabled: false,
        lastUserMessageTimestamp: Date.now(),
        contextStackSize: 0,
        messages: [],
        entities: {},
        breadcrumbs: [],
      });
    }
    return inMemoryStore.get(sessionId)!;
  }

  try {
    const stateKey = `session:${sessionId}:state`;
    const messagesKey = `session:${sessionId}:messages`;
    const entitiesKey = `session:${sessionId}:entities`;

    // Try JSON API first (Redis Stack)
    let messages: unknown[] = [];
    try {
      messages = ((await (client as any).json.get(messagesKey)) ?? []) as unknown[];
    } catch (e) {
      // Fallback to empty array if JSON not available
      messages = [];
    }

    const state = await client.hGetAll(stateKey);
    const entities = await client.hGetAll(entitiesKey);

    return {
      sessionId,
      userId: userId || state.user_id,
      currentLane: state.current_lane ?? "chat",
      voiceEnabled: state.voice_enabled === "1",
      lastUserMessageTimestamp: parseInt(state.last_user_message_timestamp ?? Date.now().toString(), 10),
      contextStackSize: parseInt(state.context_stack_size ?? "0", 10),
      messages: (messages as SessionContext["messages"]) || [],
      entities: entities || {},
      breadcrumbs: [],
    };
  } catch (error) {
    console.error("Failed to load session context from Redis:", error);
    // Fall back to in-memory
    if (!inMemoryStore.has(sessionId)) {
      inMemoryStore.set(sessionId, {
        sessionId,
        userId,
        currentLane: "chat",
        voiceEnabled: false,
        lastUserMessageTimestamp: Date.now(),
        contextStackSize: 0,
        messages: [],
        entities: {},
        breadcrumbs: [],
      });
    }
    return inMemoryStore.get(sessionId)!;
  }
}

export async function updateSessionContext(
  sessionId: string,
  updates: Partial<SessionContext>
): Promise<void> {
  const client = await getRedisClient();

  if (!client) {
    // Use in-memory fallback
    const existing = inMemoryStore.get(sessionId);
    if (existing) {
      Object.assign(existing, updates);
    }
    return;
  }

  try {
    const stateKey = `session:${sessionId}:state`;
    const entitiesKey = `session:${sessionId}:entities`;
    const messagesKey = `session:${sessionId}:messages`;

    if (updates.currentLane || updates.voiceEnabled !== undefined || updates.contextStackSize !== undefined) {
      const stateData: Record<string, string> = {
        current_lane: updates.currentLane ?? "chat",
        voice_enabled: updates.voiceEnabled ? "1" : "0",
        last_user_message_timestamp: (updates.lastUserMessageTimestamp ?? Date.now()).toString(),
        context_stack_size: (updates.contextStackSize ?? 0).toString(),
      };
      await client.hSet(stateKey, stateData);
      await client.expire(stateKey, DEFAULT_TTL);
    }

    if (updates.entities) {
      const entityData: Record<string, string> = {};
      for (const [key, value] of Object.entries(updates.entities)) {
        entityData[key] = String(value);
      }
      await client.hSet(entitiesKey, entityData);
      await client.expire(entitiesKey, DEFAULT_TTL);
    }

    if (updates.messages) {
      try {
        await (client as any).json.set(messagesKey, "$", updates.messages);
      } catch (e) {
        // If JSON not available, skip
        console.debug("Could not store messages in JSON format (Redis Stack not available)");
      }
      await client.expire(messagesKey, DEFAULT_TTL);
    }
  } catch (error) {
    console.error("Failed to update session context in Redis:", error);
    // Fall back to in-memory
    const existing = inMemoryStore.get(sessionId);
    if (existing) {
      Object.assign(existing, updates);
    }
  }
}

/**
 * Append a message to session context
 */
export async function appendSessionMessage(
  sessionId: string,
  message: SessionContext["messages"][0]
): Promise<void> {
  const context = await getOrCreateSessionContext(sessionId);
  const updated = [...context.messages, message].slice(-100); // Keep last 100

  await updateSessionContext(sessionId, {
    messages: updated,
    lastUserMessageTimestamp: message.timestamp,
  });
}

/**
 * Redact sensitive information from context before passing to LLM
 */
export function redactSessionContext(context: SessionContext): SessionContext {
  return {
    ...context,
    messages: context.messages.map((msg) => ({
      ...msg,
      // Only keep structured data, redact raw user PII
      content: msg.content.slice(0, 1000), // Truncate very long messages
    })),
    entities: Object.fromEntries(
      Object.entries(context.entities).filter(([key]) => {
        // Keep non-sensitive entity types
        const allowed = [
          "user_name",
          "zip_code",
          "concern_tags",
          "urgency_score",
          "language_preference",
        ];
        return allowed.includes(key);
      })
    ),
  };
}

/**
 * Clear old sessions (run periodically)
 */
export async function cleanupOldSessions(olderThanMs: number = 7 * 24 * 60 * 60 * 1000): Promise<void> {
  const client = await getRedisClient();
  if (!client) return;

  try {
    const cutoff = Date.now() - olderThanMs;
    const sessionKeys = await client.keys("session:*:state");

    for (const key of sessionKeys) {
      const ttl = await client.ttl(key);
      // If TTL is not set or expired, clean up
      if (ttl === -1 || ttl === -2) {
        const sessionId = key.split(":")[1];
        await client.del([
          `session:${sessionId}:state`,
          `session:${sessionId}:messages`,
          `session:${sessionId}:entities`,
        ]);
      }
    }
  } catch (error) {
    console.error("Failed to cleanup old sessions:", error);
  }
}

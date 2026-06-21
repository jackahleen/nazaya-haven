/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { getRedisClient } from "@/lib/redis/client";

/**
 * Cross-context assembly: builds a compact context string for the next LLM call
 * by reading from all services' event logs and summarizing into the session context
 */

export interface CrossServiceContext {
  sessionId: string;
  recentChat: Array<{ role: string; content: string; timestamp: number }>;
  recentResourceViews: Array<{
    name: string;
    category: string;
    timestamp: number;
  }>;
  recentVoiceTranscripts: string[];
  recentDispatchActions: Array<{
    actionType: string;
    resourceId: string;
    timestamp: number;
  }>;
}

const inMemoryEventLogs = new Map<string, CrossServiceContext>();

/**
 * Record a chat turn to the event log
 */
export async function recordChatTurn(
  sessionId: string,
  role: "user" | "assistant",
  content: string
): Promise<void> {
  const client = await getRedisClient();
  const streamKey = `chat:messages:${sessionId}`;

  if (!client) {
    // In-memory fallback
    if (!inMemoryEventLogs.has(sessionId)) {
      inMemoryEventLogs.set(sessionId, {
        sessionId,
        recentChat: [],
        recentResourceViews: [],
        recentVoiceTranscripts: [],
        recentDispatchActions: [],
      });
    }
    const ctx = inMemoryEventLogs.get(sessionId)!;
    ctx.recentChat.push({ role, content, timestamp: Date.now() });
    ctx.recentChat = ctx.recentChat.slice(-20); // Keep last 20
    return;
  }

  try {
    await client.xAdd(streamKey, "*", {
      role,
      content: content.slice(0, 5000), // Truncate very long content
      timestamp: Date.now().toString(),
      embedding_pending: "true",
    });

    // Auto-trim to prevent unbounded growth
    await client.xTrim(streamKey, "MAXLEN", 500);
  } catch (error) {
    console.error("Failed to record chat turn:", error);
  }
}

/**
 * Record a resource view
 */
export async function recordResourceSearch(
  sessionId: string,
  resourceId: string,
  resourceName: string,
  category: string
): Promise<void> {
  const client = await getRedisClient();
  const streamKey = `resources:viewed:${sessionId}`;

  if (!client) {
    // In-memory fallback
    if (!inMemoryEventLogs.has(sessionId)) {
      inMemoryEventLogs.set(sessionId, {
        sessionId,
        recentChat: [],
        recentResourceViews: [],
        recentVoiceTranscripts: [],
        recentDispatchActions: [],
      });
    }
    const ctx = inMemoryEventLogs.get(sessionId)!;
    ctx.recentResourceViews.push({ name: resourceName, category, timestamp: Date.now() });
    ctx.recentResourceViews = ctx.recentResourceViews.slice(-20);
    return;
  }

  try {
    await client.xAdd(streamKey, "*", {
      resource_id: resourceId,
      resource_name: resourceName,
      category,
      timestamp: Date.now().toString(),
    });

    await client.xTrim(streamKey, "MAXLEN", 200);
  } catch (error) {
    console.error("Failed to record resource search:", error);
  }
}

/**
 * Record a voice intent from voice session
 */
export async function recordVoiceIntent(
  sessionId: string,
  transcript: string,
  sentiment: "positive" | "neutral" | "negative"
): Promise<void> {
  const client = await getRedisClient();
  const streamKey = `voice:transcriptions:${sessionId}`;

  if (!client) {
    // In-memory fallback
    if (!inMemoryEventLogs.has(sessionId)) {
      inMemoryEventLogs.set(sessionId, {
        sessionId,
        recentChat: [],
        recentResourceViews: [],
        recentVoiceTranscripts: [],
        recentDispatchActions: [],
      });
    }
    const ctx = inMemoryEventLogs.get(sessionId)!;
    ctx.recentVoiceTranscripts.push(transcript);
    ctx.recentVoiceTranscripts = ctx.recentVoiceTranscripts.slice(-5);
    return;
  }

  try {
    await client.xAdd(streamKey, "*", {
      transcript_text: transcript.slice(0, 2000),
      sentiment,
      timestamp: Date.now().toString(),
    });

    await client.xTrim(streamKey, "MAXLEN", 100);
  } catch (error) {
    console.error("Failed to record voice intent:", error);
  }
}

/**
 * Record a dispatch action
 */
export async function recordDispatch(
  sessionId: string,
  actionType: string,
  resourceId: string,
  outcome: "pending" | "completed" | "failed" = "pending"
): Promise<void> {
  const client = await getRedisClient();
  const streamKey = `dispatch:actions:${sessionId}`;

  if (!client) {
    // In-memory fallback
    if (!inMemoryEventLogs.has(sessionId)) {
      inMemoryEventLogs.set(sessionId, {
        sessionId,
        recentChat: [],
        recentResourceViews: [],
        recentVoiceTranscripts: [],
        recentDispatchActions: [],
      });
    }
    const ctx = inMemoryEventLogs.get(sessionId)!;
    ctx.recentDispatchActions.push({ actionType, resourceId, timestamp: Date.now() });
    ctx.recentDispatchActions = ctx.recentDispatchActions.slice(-10);
    return;
  }

  try {
    await client.xAdd(streamKey, "*", {
      action_type: actionType,
      resource_id: resourceId,
      outcome,
      timestamp: Date.now().toString(),
    });

    await client.xTrim(streamKey, "MAXLEN", 150);
  } catch (error) {
    console.error("Failed to record dispatch action:", error);
  }
}

/**
 * Build a compact cross-context string for LLM consumption
 */
export async function buildCrossContext(sessionId: string): Promise<string> {
  const client = await getRedisClient();

  if (!client) {
    // In-memory fallback
    const ctx = inMemoryEventLogs.get(sessionId);
    if (!ctx) return "";

    const parts: string[] = [];

    if (ctx.recentChat.length > 0) {
      const lastUserMsg = ctx.recentChat.find((m) => m.role === "user");
      if (lastUserMsg) {
        parts.push(`User's last message: "${lastUserMsg.content.slice(0, 200)}"`);
      }
    }

    if (ctx.recentResourceViews.length > 0) {
      const categories = [...new Set(ctx.recentResourceViews.map((r) => r.category))];
      parts.push(`User is interested in: ${categories.join(", ")}`);
    }

    if (ctx.recentVoiceTranscripts.length > 0) {
      parts.push(`Voice input: "${ctx.recentVoiceTranscripts[0].slice(0, 100)}..."`);
    }

    if (ctx.recentDispatchActions.length > 0) {
      parts.push(`User has taken ${ctx.recentDispatchActions.length} action(s) recently`);
    }

    return parts.join("\n");
  }

  try {
    const parts: string[] = [];

    // Read chat stream
    try {
      const chatMessages = await client.xRevRange(`chat:messages:${sessionId}`, "+", "-");

      if (chatMessages.length > 10) {
        // Limit to 10
        chatMessages.length = 10;
      }

      if (chatMessages.length > 0) {
        const lastMessage = chatMessages[0];
        const content = (lastMessage.message as Record<string, string>).content || "";
        parts.push(`Recent user message: "${content.slice(0, 200)}"`);
      }
    } catch (e) {
      // Stream may not exist
    }

    // Read resource views
    try {
      const resourceViews = await client.xRevRange(
        `resources:viewed:${sessionId}`,
        "+",
        "-"
      );

      if (resourceViews.length > 5) {
        resourceViews.length = 5;
      }

      if (resourceViews.length > 0) {
        const categories = new Set(
          resourceViews.map((e) => (e.message as Record<string, string>).category)
        );
        if (categories.size > 0) {
          parts.push(`User has searched for: ${Array.from(categories).join(", ")}`);
        }
      }
    } catch (e) {
      // Stream may not exist
    }

    // Read voice transcripts
    try {
      const voiceMessages = await client.xRevRange(
        `voice:transcriptions:${sessionId}`,
        "+",
        "-"
      );

      if (voiceMessages.length > 3) {
        voiceMessages.length = 3;
      }

      if (voiceMessages.length > 0) {
        const transcript = (voiceMessages[0].message as Record<string, string>).transcript_text || "";
        if (transcript) {
          parts.push(`Voice input: "${transcript.slice(0, 100)}..."`);
        }
      }
    } catch (e) {
      // Stream may not exist
    }

    // Read dispatch actions
    try {
      const dispatchActions = await client.xRevRange(
        `dispatch:actions:${sessionId}`,
        "+",
        "-"
      );

      if (dispatchActions.length > 5) {
        dispatchActions.length = 5;
      }

      if (dispatchActions.length > 0) {
        parts.push(
          `User has initiated ${dispatchActions.length} action(s): ${dispatchActions
            .map((e) => (e.message as Record<string, string>).action_type)
            .slice(0, 3)
            .join(", ")}`
        );
      }
    } catch (e) {
      // Stream may not exist
    }

    return parts.join("\n");
  } catch (error) {
    console.error("Failed to build cross-context:", error);
    return "";
  }
}

/**
 * Clear event logs for a session (cleanup)
 */
export async function clearSessionEventLogs(sessionId: string): Promise<void> {
  const client = await getRedisClient();

  if (!client) {
    inMemoryEventLogs.delete(sessionId);
    return;
  }

  try {
    const keys = [
      `chat:messages:${sessionId}`,
      `resources:viewed:${sessionId}`,
      `voice:transcriptions:${sessionId}`,
      `dispatch:actions:${sessionId}`,
    ];

    for (const key of keys) {
      try {
        await client.del(key);
      } catch (e) {
        // Key may not exist
      }
    }
  } catch (error) {
    console.error("Failed to clear session event logs:", error);
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { getRedisClient } from "@/lib/redis/client";
import { embedText } from "@/lib/embeddings/factory";

/**
 * Long-term memory storage (per user, vector-indexed)
 * Requires Redis Stack (RedisJSON + RediSearch) for full functionality
 * Falls back to in-memory storage when unavailable
 */

export interface MemoryTurn {
  sessionId: string;
  turnNumber: number;
  lane: "chat" | "resources" | "voice" | "dispatch";
  content: string;
  contentEmbedding: Float32Array;
  entities: Record<string, unknown>;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

export interface UserPreferences {
  userId: string;
  preferredLanguage?: string;
  preferredResourceTypes?: string[];
  accessibilityNeeds?: string[];
  knownZipCodes?: number[];
  lastUpdated: number;
}

const inMemoryMemory = new Map<string, MemoryTurn[]>();
const inMemoryPreferences = new Map<string, UserPreferences>();

const LONG_TERM_TTL = 90 * 24 * 60 * 60; // 90 days

/**
 * Store a turn in long-term memory
 */
export async function storeMemoryTurn(
  userId: string,
  turnData: Omit<MemoryTurn, "contentEmbedding"> & {
    contentEmbedding?: Float32Array;
  }
): Promise<string> {
  const client = await getRedisClient();
  const turnUuid = generateUUID();

  // Embed content if not provided
  const embedding =
    turnData.contentEmbedding || (await embedText(turnData.content));

  if (!client) {
    // In-memory fallback
    if (!inMemoryMemory.has(userId)) {
      inMemoryMemory.set(userId, []);
    }
    const turns = inMemoryMemory.get(userId)!;
    turns.push({
      ...turnData,
      contentEmbedding: embedding,
    });
    // Keep last 1000 turns
    if (turns.length > 1000) {
      inMemoryMemory.set(userId, turns.slice(-1000));
    }
    return turnUuid;
  }

  try {
    const memoryKey = `mem:${userId}:turn:${turnUuid}`;

    // Convert Float32Array to regular array for JSON serialization
    const embeddingArray = Array.from(embedding);

    await (client as any).json.set(memoryKey, "$", {
      session_id: turnData.sessionId,
      turn_number: turnData.turnNumber,
      lane: turnData.lane,
      content: turnData.content,
      content_embedding: embeddingArray,
      entities: turnData.entities,
      timestamp: turnData.timestamp,
      metadata: turnData.metadata,
      ttl_or_archived: false,
    });

    // Set TTL
    await client.expire(memoryKey, LONG_TERM_TTL);

    return turnUuid;
  } catch (error) {
    console.error("Failed to store memory turn in Redis:", error);
    // Fall back to in-memory
    if (!inMemoryMemory.has(userId)) {
      inMemoryMemory.set(userId, []);
    }
    const turns = inMemoryMemory.get(userId)!;
    turns.push({
      ...turnData,
      contentEmbedding: embedding,
    });
    if (turns.length > 1000) {
      inMemoryMemory.set(userId, turns.slice(-1000));
    }
    return turnUuid;
  }
}

/**
 * Retrieve a memory turn by ID
 */
export async function getMemoryTurn(
  userId: string,
  turnUuid: string
): Promise<MemoryTurn | null> {
  const client = await getRedisClient();

  if (!client) {
    // In-memory fallback
    const turns = inMemoryMemory.get(userId) || [];
    const turn = turns.find((t) => t.sessionId === turnUuid); // Simple search
    return turn || null;
  }

  try {
    const memoryKey = `mem:${userId}:turn:${turnUuid}`;
    const data = (await (client as any).json.get(memoryKey)) as any;

    if (!data) return null;

    return {
      sessionId: data.session_id,
      turnNumber: data.turn_number,
      lane: data.lane,
      content: data.content,
      contentEmbedding: new Float32Array(data.content_embedding || []),
      entities: data.entities,
      timestamp: data.timestamp,
      metadata: data.metadata,
    };
  } catch (error) {
    console.error("Failed to retrieve memory turn from Redis:", error);
    return null;
  }
}

/**
 * Semantic search over user's memory (requires Redis Stack)
 */
export async function semanticSearchMemory(
  userId: string,
  queryEmbedding: Float32Array,
  options?: {
    lane?: string;
    topK?: number;
    recentHoursOnly?: number;
  }
): Promise<
  Array<{
    id: string;
    lane: string;
    content: string;
    entities: Record<string, unknown>;
    score: number;
  }>
> {
  const client = await getRedisClient();
  const topK = options?.topK ?? 5;

  if (!client) {
    // In-memory fallback: simple cosine similarity search
    const turns = inMemoryMemory.get(userId) || [];

    const scored = turns
      .filter((t) => {
        if (options?.lane && t.lane !== options.lane) return false;
        if (options?.recentHoursOnly) {
          const cutoff = Date.now() - options.recentHoursOnly * 60 * 60 * 1000;
          return t.timestamp > cutoff;
        }
        return true;
      })
      .map((t) => ({
        turn: t,
        score: cosineSimilarity(queryEmbedding, t.contentEmbedding),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);

    return scored.map((s) => ({
      id: `${s.turn.sessionId}:${s.turn.turnNumber}`,
      lane: s.turn.lane,
      content: s.turn.content,
      entities: s.turn.entities,
      score: s.score,
    }));
  }

  try {
    // Check if RediSearch is available
    const capabilities = await (client as any).ft
      .info("idx:memvec")
      .then(() => true)
      .catch(() => false);

    if (!capabilities) {
      // Fallback: return recent memories by timestamp
      console.info("Redis Stack not available; using recent-memories fallback");
      const keys = await client.keys(`mem:${userId}:turn:*`);
      const memories = [];

      for (const key of keys.slice(-topK)) {
        try {
          const data = (await (client as any).json.get(key)) as any;
          if (data) {
            memories.push({
              id: key,
              lane: data.lane,
              content: data.content,
              entities: data.entities,
              score: 0, // No score in fallback
            });
          }
        } catch (e) {
          // Skip if can't read
        }
      }

      return memories.sort((a, b) => b.score - a.score);
    }

    // Vector search with RediSearch
    const queryStr = buildQueryString(userId, options);
    const params: Record<string, unknown> = {
      query_vector: Buffer.from(queryEmbedding.buffer),
    };

    const results = await (client as any).ft.search("idx:memvec", queryStr, {
      PARAMS: params,
      RETURN: ["content", "lane", "entities", "score"],
      DIALECT: 2,
    });

    return results.documents.map((doc: any) => ({
      id: doc.id,
      lane: doc.value.lane,
      content: doc.value.content,
      entities: parseJSON(doc.value.entities),
      score: parseFloat(doc.value.score) || 0,
    }));
  } catch (error) {
    console.error("Failed to search memory:", error);
    return [];
  }
}

/**
 * Get all memory turns for a user (with optional filtering)
 */
export async function getMemoryTurns(
  userId: string,
  options?: {
    lane?: string;
    limit?: number;
    offset?: number;
  }
): Promise<MemoryTurn[]> {
  const client = await getRedisClient();
  const limit = options?.limit ?? 50;
  const offset = options?.offset ?? 0;

  if (!client) {
    // In-memory fallback
    let turns = inMemoryMemory.get(userId) || [];
    if (options?.lane) {
      turns = turns.filter((t) => t.lane === options.lane);
    }
    return turns.slice(offset, offset + limit);
  }

  try {
    const pattern = `mem:${userId}:turn:*`;
    const keys = await client.keys(pattern);

    const filtered = [];
    for (const key of keys) {
      try {
        const data = (await (client as any).json.get(key)) as any;
        if (data && (!options?.lane || data.lane === options.lane)) {
          filtered.push({
            sessionId: data.session_id,
            turnNumber: data.turn_number,
            lane: data.lane,
            content: data.content,
            contentEmbedding: new Float32Array(data.content_embedding || []),
            entities: data.entities,
            timestamp: data.timestamp,
            metadata: data.metadata,
          });
        }
      } catch (e) {
        // Skip if can't read
      }
    }

    return filtered.slice(offset, offset + limit);
  } catch (error) {
    console.error("Failed to get memory turns:", error);
    return [];
  }
}

/**
 * Store or update user preferences
 */
export async function storeUserPreferences(
  userId: string,
  prefs: Partial<UserPreferences>
): Promise<void> {
  const client = await getRedisClient();

  if (!client) {
    // In-memory fallback
    const existing = inMemoryPreferences.get(userId) || {
      userId,
      lastUpdated: Date.now(),
    };
    Object.assign(existing, prefs, { lastUpdated: Date.now() });
    inMemoryPreferences.set(userId, existing);
    return;
  }

  try {
    const prefKey = `mem:${userId}:preference`;
    const existing = ((await (client as any).json.get(prefKey)) as any) || {
      userId,
    };

    const updated = {
      ...existing,
      ...prefs,
      lastUpdated: Date.now(),
    };

    await (client as any).json.set(prefKey, "$", updated);
    await client.expire(prefKey, LONG_TERM_TTL);
  } catch (error) {
    console.error("Failed to store user preferences:", error);
    // Fall back to in-memory
    const existing = inMemoryPreferences.get(userId) || {
      userId,
      lastUpdated: Date.now(),
    };
    Object.assign(existing, prefs, { lastUpdated: Date.now() });
    inMemoryPreferences.set(userId, existing);
  }
}

/**
 * Get user preferences
 */
export async function getUserPreferences(
  userId: string
): Promise<UserPreferences | null> {
  const client = await getRedisClient();

  if (!client) {
    return inMemoryPreferences.get(userId) || null;
  }

  try {
    const prefKey = `mem:${userId}:preference`;
    const data = (await (client as any).json.get(prefKey)) as any;
    return data || null;
  } catch (error) {
    console.error("Failed to get user preferences:", error);
    return null;
  }
}

/**
 * Helper: build vector search query string
 */
function buildQueryString(
  userId: string,
  options?: { lane?: string; recentHoursOnly?: number }
): string {
  let query = `@user_id:{${userId}}`;

  if (options?.lane) {
    query += ` @lane:{${options.lane}}`;
  }

  if (options?.recentHoursOnly) {
    const cutoff = Date.now() - options.recentHoursOnly * 60 * 60 * 1000;
    query += ` @timestamp:[${cutoff} +inf]`;
  }

  return query + ` => [KNN 5 @content_embedding $query_vector AS score]`;
}

/**
 * Helper: cosine similarity between two float32 vectors
 */
function cosineSimilarity(a: Float32Array, b: Float32Array): number {
  if (a.length !== b.length) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  return denominator === 0 ? 0 : dotProduct / denominator;
}

/**
 * Helper: safe JSON parse
 */
function parseJSON(str: string): Record<string, unknown> {
  try {
    return JSON.parse(str);
  } catch {
    return {};
  }
}

/**
 * Helper: simple UUID generator (deterministic alternative to Date.now)
 */
function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

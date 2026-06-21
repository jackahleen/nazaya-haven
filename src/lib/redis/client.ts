/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "redis";

type RedisClient = ReturnType<typeof createClient>;

let redisClient: RedisClient | null = null;
let isConnecting = false;

export async function getRedisClient(): Promise<RedisClient | null> {
  const url = process.env.REDIS_URL;
  if (!url) return null;

  if (redisClient && redisClient.isOpen) {
    return redisClient;
  }

  if (isConnecting) {
    // Wait for connection to complete
    let attempts = 0;
    while (isConnecting && attempts < 100) {
      await new Promise((r) => setTimeout(r, 50));
      attempts++;
    }
    return redisClient && redisClient.isOpen ? redisClient : null;
  }

  try {
    isConnecting = true;
    redisClient = createClient({
      url,
      socket: {
        reconnectStrategy: (retries) => Math.min(retries * 50, 500),
      },
    });

    redisClient.on("error", (error) => {
      console.error("Redis client error", error);
    });

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
    redisClient = null;
    return null;
  } finally {
    isConnecting = false;
  }
}

export async function closeRedisClient() {
  if (redisClient?.isOpen) {
    try {
      await redisClient.quit();
    } catch (e) {
      console.error("Error closing Redis client:", e);
    }
    redisClient = null;
  }
}

/**
 * Check if Redis Stack (RediSearch + RedisJSON) capabilities are available
 */
export async function checkRedisStackCapabilities(
  client: RedisClient
): Promise<{
  hasSearch: boolean;
  hasJSON: boolean;
  hasStreams: boolean;
}> {
  try {
    // Check if RediSearch and RedisJSON modules are loaded
    const info = await client.sendCommand(["INFO", "modules"]);
    const hasSearch = String(info).includes("search");
    const hasJSON = String(info).includes("json");
    const hasStreams = true; // Streams are in core Redis since v5.0

    return { hasSearch, hasJSON, hasStreams };
  } catch (e) {
    console.warn("Could not check Redis capabilities:", e);
    return { hasSearch: false, hasJSON: false, hasStreams: true };
  }
}

/**
 * Ensure vector index exists for long-term memory (requires Redis Stack)
 */
export async function ensureVectorIndexCreated(
  client: RedisClient,
  capabilities: { hasSearch: boolean }
): Promise<void> {
  if (!capabilities.hasSearch) {
    console.info("Redis Stack not available; skipping vector index creation");
    return;
  }

  try {
    await (client as any).ft.info("idx:memvec");
    // Index exists
    return;
  } catch (e: any) {
    if (!String(e).includes("no such index")) {
      console.error("Error checking vector index:", e);
      return;
    }
  }

  // Index doesn't exist, create it
  try {
    await (client as any).ft.create(
      "idx:memvec",
      {
        "$.content_embedding": {
          type: "VECTOR",
          ALGORITHM: "HNSW",
          TYPE: "FLOAT32",
          DIM: 768,
          DISTANCE_METRIC: "COSINE",
          AS: "content_embedding",
          M: 16,
          EF_CONSTRUCTION: 200,
          EF_RUNTIME: 10,
        },
        "$.lane": {
          type: "TAG",
          AS: "lane",
        },
        "$.user_id": {
          type: "TAG",
          AS: "user_id",
        },
        "$.timestamp": {
          type: "NUMERIC",
          SORTABLE: true,
          AS: "timestamp",
        },
      },
      {
        ON: "JSON",
        PREFIX: "mem:",
      }
    );
    console.info("Vector index created: idx:memvec");
  } catch (e) {
    console.error("Failed to create vector index:", e);
  }
}

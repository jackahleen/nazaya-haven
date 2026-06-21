import { getRedisClient } from "@/lib/redis/client";

export async function readJsonCache<T>(key: string): Promise<T | null> {
  try {
    const client = await getRedisClient();
    if (!client) return null;

    const value = await client.get(key);
    return value ? (JSON.parse(value) as T) : null;
  } catch (error) {
    console.error("Redis cache read failed", error);
    return null;
  }
}

export async function writeJsonCache(
  key: string,
  value: unknown,
  ttlSeconds: number,
) {
  try {
    const client = await getRedisClient();
    if (!client) return;

    await client.set(key, JSON.stringify(value), { EX: ttlSeconds });
  } catch (error) {
    console.error("Redis cache write failed", error);
  }
}

import { getRedisClient } from "@/lib/redis/client";
import { cacheKey } from "@/lib/cache/cache-keys";
import { readJsonCache, writeJsonCache } from "@/lib/cache/json-cache";
import {
  type CommunityResource,
  type CommunityResourceCategory,
  type CommunityResourceResults,
} from "@/data/community-resources";
import { allFreeSources } from "./free-sources";

/**
 * Map zip to county (matches logic in community-resources.ts)
 */
function countyFromZip(zip: string): string {
  if (zip.startsWith("941")) return "San Francisco";
  if (zip.startsWith("946") || zip.startsWith("947")) return "Alameda";
  if (zip.startsWith("949")) return "Marin";
  return "Bay Area";
}

/**
 * Generate a cache key for resources by category+county
 */
function freeCacheKey(category: CommunityResourceCategory, county: string): string {
  return cacheKey("free-resources", { category, county });
}

/**
 * Warm the free-source cache by fetching from all sources and storing in Redis.
 * This can be called periodically (e.g., on server start or via a cron job).
 * Gracefully handles missing REDIS_URL (no-op when Redis unavailable).
 */
export async function warmResourceCache(
  categories: readonly CommunityResourceCategory[],
  counties: readonly string[] = ["San Francisco", "Alameda", "Marin", "Bay Area"],
): Promise<void> {
  const client = await getRedisClient();
  if (!client) {
    console.info("Redis unavailable; free-source cache warming skipped");
    return;
  }

  for (const county of counties) {
    for (const category of categories) {
      const key = freeCacheKey(category, county);

      // Skip if already cached
      const cached = await readJsonCache<CommunityResource[]>(key);
      if (cached) {
        console.info(
          `Cache hit for ${category} in ${county}; skipping warm`,
        );
        continue;
      }

      // Fetch from all sources in parallel
      const results = await Promise.all(
        allFreeSources.map((source) =>
          source.fetchByCategory(category, { county }).catch(() => []),
        ),
      );

      // Merge and deduplicate results
      const merged = deduplicateResources(results.flat());

      // Write to cache
      await writeJsonCache(key, merged, 60 * 60 * 24); // 24h TTL
      console.info(
        `Warmed cache for ${category} in ${county}: ${merged.length} resources`,
      );
    }
  }
}

/**
 * Get cached resources for a given zip and categories.
 * Falls back to free sources if not cached.
 * Gracefully handles missing REDIS_URL by using free sources directly.
 */
export async function getCachedResources({
  zip,
  categories,
}: {
  zip: string;
  categories: readonly CommunityResourceCategory[];
}): Promise<CommunityResourceResults> {
  const county = countyFromZip(zip);
  const result: CommunityResourceResults = {};

  for (const category of categories) {
    const key = freeCacheKey(category, county);

    // Try cache first
    let resources = await readJsonCache<CommunityResource[]>(key);

    // If not cached, fetch from free sources and cache for future use
    if (!resources) {
      const sourceResults = await Promise.all(
        allFreeSources.map((source) =>
          source.fetchByCategory(category, { zip, county }).catch(() => []),
        ),
      );
      resources = deduplicateResources(sourceResults.flat());

      // Write to cache for next time (best effort)
      await writeJsonCache(key, resources, 60 * 60 * 24);
    }

    result[category] = resources;
  }

  // Always add national resources from curated source
  try {
    const national = await allFreeSources[0].fetchByCategory("community", { zip });
    if (national.length > 0) {
      result.national = national.filter((r: CommunityResource) => r.name === "211");
    }
  } catch {
    // Ignore errors; national might not be populated
  }

  return result;
}

/**
 * Deduplicate resources by name (case-insensitive).
 * Keeps the first occurrence of each unique name.
 */
function deduplicateResources(resources: CommunityResource[]): CommunityResource[] {
  const seen = new Set<string>();
  return resources.filter((resource) => {
    const key = resource.name.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

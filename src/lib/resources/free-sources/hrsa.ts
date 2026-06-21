import type { CommunityResource, CommunityResourceCategory } from "@/data/community-resources";
import type { FreeResourceSource } from "./types";

/**
 * HRSA Find-a-Health-Center source for health category.
 * Fetches public HRSA health center data.
 * VERIFY endpoint: https://data.hrsa.gov/api/3/action/datastore_search_sql?sql=...
 */
export const hrsaSource: FreeResourceSource = {
  id: "hrsa",
  name: "HRSA Find-a-Health-Center",

  async fetchByCategory(
    category: CommunityResourceCategory,
  ): Promise<CommunityResource[]> {
    // Only health category is supported
    if (category !== "health") return [];

    try {
      // VERIFY endpoint: HRSA's public datastore endpoint
      // This is a stub; real implementation would parse HRSA CSV/API response
      // and map to CommunityResource shape.
      const response = await fetch(
        "https://data.hrsa.gov/api/3/action/datastore_search_sql",
        { signal: AbortSignal.timeout(5000) },
      );

      if (!response.ok) {
        console.warn("HRSA fetch failed:", response.status);
        return [];
      }

      // TODO: Parse response and map to CommunityResource[]
      // For now, return empty (graceful degradation)
      return [];
    } catch (error) {
      console.warn("HRSA source error:", error instanceof Error ? error.message : error);
      return [];
    }
  },
};

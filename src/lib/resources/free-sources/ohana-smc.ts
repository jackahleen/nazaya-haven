import type { CommunityResource, CommunityResourceCategory } from "@/data/community-resources";
import type { FreeResourceSource } from "./types";

/**
 * Ohana HSDS API for SMC-Connect (San Mateo County).
 * Supports all categories via keyword mapping.
 * VERIFY endpoint: https://smc-connect.org/api/v1/search
 */
export const ohanaSMCSource: FreeResourceSource = {
  id: "ohana-smc",
  name: "SMC-Connect Ohana API",

  async fetchByCategory(
    category: CommunityResourceCategory,
  ): Promise<CommunityResource[]> {
    try {
      // Map category to Ohana HSDS keyword for search
      const categoryKeywordMap: Record<CommunityResourceCategory, string> = {
        housing: "housing",
        food: "food bank",
        family: "childcare",
        health: "health center",
        community: "community center",
      };

      const keyword = categoryKeywordMap[category];

      // VERIFY endpoint: SMC-Connect's Ohana HSDS API
      // Stub implementation; real version would parse HSDS org/service response.
      const response = await fetch(
        `https://smc-connect.org/api/v1/search?q=${encodeURIComponent(keyword)}`,
        { signal: AbortSignal.timeout(5000) },
      );

      if (!response.ok) {
        console.warn("Ohana SMC fetch failed:", response.status);
        return [];
      }

      // TODO: Parse HSDS response and map to CommunityResource[]
      // For now, return empty (graceful degradation)
      return [];
    } catch (error) {
      console.warn("Ohana SMC source error:", error instanceof Error ? error.message : error);
      return [];
    }
  },
};

import type { CommunityResource, CommunityResourceCategory } from "@/data/community-resources";
import type { FreeResourceSource } from "./types";

/**
 * SAMHSA FindTreatment locator source for health/mental-health.
 * VERIFY endpoint: https://findtreatment.gov/api/...
 */
export const samhsaSource: FreeResourceSource = {
  id: "samhsa",
  name: "SAMHSA FindTreatment",

  async fetchByCategory(
    category: CommunityResourceCategory,
  ): Promise<CommunityResource[]> {
    // Only health category is supported
    if (category !== "health") return [];

    try {
      // VERIFY endpoint: SAMHSA FindTreatment API
      // Stub implementation; real version would call their API and parse results.
      const response = await fetch("https://findtreatment.gov/api/v1/facilities", {
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) {
        console.warn("SAMHSA fetch failed:", response.status);
        return [];
      }

      // TODO: Parse response and map to CommunityResource[]
      // For now, return empty (graceful degradation)
      return [];
    } catch (error) {
      console.warn("SAMHSA source error:", error instanceof Error ? error.message : error);
      return [];
    }
  },
};

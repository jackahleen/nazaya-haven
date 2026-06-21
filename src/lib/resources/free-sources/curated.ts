import {
  type CommunityResource,
  type CommunityResourceCategory,
  findStaticCommunityResources,
} from "@/data/community-resources";
import type { FreeResourceSource } from "./types";

/**
 * Curated source: wraps the existing static community-resources.ts data.
 * This is the foundation and always available, never throws.
 */
export const curatedSource: FreeResourceSource = {
  id: "curated",
  name: "Curated Bay Area Resources",

  async fetchByCategory(
    category: CommunityResourceCategory,
    location: { zip?: string },
  ): Promise<CommunityResource[]> {
    try {
      if (!location.zip) return [];

      const results = findStaticCommunityResources({
        zip: location.zip,
        categories: [category],
      });

      return results[category] || [];
    } catch {
      return [];
    }
  },
};

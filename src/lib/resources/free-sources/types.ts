import type { CommunityResource, CommunityResourceCategory } from "@/data/community-resources";

export interface FreeResourceSource {
  id: string;
  name: string;
  /**
   * Fetch resources for a given category and location.
   * Must never throw; return [] on any error (network, parse, etc).
   */
  fetchByCategory(
    category: CommunityResourceCategory,
    location: { zip?: string; county?: string },
  ): Promise<CommunityResource[]>;
}

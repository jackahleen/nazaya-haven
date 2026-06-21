import {
  type CommunityResourceCategory,
  type CommunityResourceResults,
  findStaticCommunityResources,
} from "@/data/community-resources";

export const resourceDemoModeNotice =
  "Demo mode: using built-in Bay Area sample resources while live search is unavailable on static GitHub Pages.";

export function getDemoCommunityResourceResults({
  zip,
  categories,
}: {
  zip: string;
  categories: readonly CommunityResourceCategory[];
}): CommunityResourceResults {
  return findStaticCommunityResources({ zip, categories });
}

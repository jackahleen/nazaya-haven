import {
  type CuratedResource,
  type ResourceCategory,
  curatedResources,
} from "@/data/resources";

export type ResourceSearchInput = {
  category: ResourceCategory;
  county: string;
};

export function searchCuratedResources(input: ResourceSearchInput): CuratedResource[] {
  return curatedResources.filter((resource) => {
    return (
      resource.category === input.category &&
      (resource.counties.includes(input.county) || resource.counties.includes("Bay Area"))
    );
  });
}

import {
  type LegalNeedType,
  type LegalResource,
  legalResources,
} from "@/data/legal-resources";
import { zipCodeToCounty } from "./zipCodeToCounty";

export interface FindMatchingResourcesParams {
  zipCode: string;
  needType?: LegalNeedType | "all";
  language?: string;
}

/**
 * Finds legal resources matching user criteria
 * @param params - Search parameters
 * @returns Array of matching resources, sorted by relevance
 */
export function findMatchingResources(
  params: FindMatchingResourcesParams
): LegalResource[] {
  const { zipCode, needType = "all", language } = params;

  // Get county from ZIP code
  const county = zipCodeToCounty(zipCode);
  if (!county) {
    return [];
  }

  // Filter resources
  let results = legalResources.filter((resource) => {
    // Check if resource serves this county or is statewide
    const serveCounty =
      resource.countyServed.includes(county) ||
      resource.countyServed.includes("California-Wide");

    if (!serveCounty) {
      return false;
    }

    // Check legal need type
    if (needType !== "all" && !resource.types.includes(needType)) {
      return false;
    }

    // Check language if specified
    if (
      language &&
      language !== "Any" &&
      !resource.languages.some(
        (lang) => lang.toLowerCase() === language.toLowerCase()
      )
    ) {
      return false;
    }

    return true;
  });

  // Sort by relevance:
  // 1. Exact need type match (if specified)
  // 2. More specific (fewer counties = more local)
  // 3. Free services first
  results.sort((a, b) => {
    // If specific need type was requested, prioritize exact matches
    if (needType !== "all") {
      const aHasNeed = a.types.includes(needType as LegalNeedType);
      const bHasNeed = b.types.includes(needType as LegalNeedType);
      if (aHasNeed !== bHasNeed) {
        return aHasNeed ? -1 : 1;
      }
    }

    // Prioritize more local (fewer counties served = more specialized)
    if (a.countyServed.length !== b.countyServed.length) {
      return a.countyServed.length - b.countyServed.length;
    }

    // Prioritize free services
    if (a.costModel === "Free" && b.costModel !== "Free") return -1;
    if (a.costModel !== "Free" && b.costModel === "Free") return 1;

    // Alphabetical by name
    return a.name.localeCompare(b.name);
  });

  return results;
}

/**
 * Get all unique counties served
 */
export function getAllServedCounties(): string[] {
  const counties = new Set<string>();
  legalResources.forEach((resource) => {
    resource.countyServed.forEach((county) => {
      if (county !== "California-Wide") {
        counties.add(county);
      }
    });
  });
  return Array.from(counties).sort();
}

/**
 * Get all unique languages supported
 */
export function getAllSupportedLanguages(): string[] {
  const languages = new Set<string>();
  legalResources.forEach((resource) => {
    resource.languages.forEach((lang) => {
      languages.add(lang);
    });
  });
  return Array.from(languages).sort();
}

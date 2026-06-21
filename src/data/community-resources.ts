export type CommunityResourceCategory =
  | "housing"
  | "food"
  | "family"
  | "health"
  | "community";

export type CommunityResource = {
  name: string;
  description: string;
  phone: string;
  website: string;
  address?: string;
  counties: readonly string[];
};

export type CommunityResourceResults = Partial<
  Record<CommunityResourceCategory | "national", CommunityResource[]>
>;

type StaticResourceSearchParams = {
  zip: string;
  categories: readonly CommunityResourceCategory[];
};

const resourceDirectory: Record<
  CommunityResourceCategory | "national",
  CommunityResource[]
> = {
  housing: [
    {
      name: "Compass Family Services",
      description:
        "Static preview result for family homelessness prevention, shelter navigation, and housing stabilization in San Francisco.",
      phone: "(415) 644-0504",
      website: "https://www.compass-sf.org/",
      address: "San Francisco, CA",
      counties: ["San Francisco", "Bay Area"],
    },
    {
      name: "Bay Area Community Services",
      description:
        "Housing navigation, behavioral health, and family support services for Bay Area households.",
      phone: "(510) 613-0330",
      website: "https://www.bayareacs.org/",
      address: "Oakland, CA",
      counties: ["Alameda", "Bay Area"],
    },
  ],
  food: [
    {
      name: "San Francisco-Marin Food Bank",
      description:
        "Food pantry lookup, CalFresh support, and family grocery programs.",
      phone: "(415) 282-1900",
      website: "https://www.sfmfoodbank.org/",
      address: "San Francisco, CA",
      counties: ["San Francisco", "Marin", "Bay Area"],
    },
  ],
  family: [
    {
      name: "Children's Council of San Francisco",
      description:
        "Child care referrals, parenting workshops, and family support resources.",
      phone: "(415) 276-2900",
      website: "https://www.childrenscouncil.org/",
      address: "San Francisco, CA",
      counties: ["San Francisco", "Bay Area"],
    },
  ],
  health: [
    {
      name: "RAMS",
      description:
        "Community mental health, wellness, and family counseling support.",
      phone: "(415) 668-5955",
      website: "https://ramsinc.org/",
      address: "San Francisco, CA",
      counties: ["San Francisco", "Bay Area"],
    },
  ],
  community: [
    {
      name: "Family Paths",
      description:
        "Parent support hotline, family counseling, and caregiver support programs.",
      phone: "1-800-829-3777",
      website: "https://familypaths.org/",
      address: "Oakland, CA",
      counties: ["Alameda", "Bay Area"],
    },
  ],
  national: [
    {
      name: "211",
      description:
        "National social-service navigation line for housing, food, health, and family support referrals.",
      phone: "211",
      website: "https://www.211.org/",
      counties: ["National"],
    },
  ],
};

function countyFromZip(zip: string): string {
  if (zip.startsWith("941")) return "San Francisco";
  if (zip.startsWith("946") || zip.startsWith("947")) return "Alameda";
  if (zip.startsWith("949")) return "Marin";
  return "Bay Area";
}

function matchesCounty(resource: CommunityResource, county: string) {
  return (
    resource.counties.includes(county) ||
    resource.counties.includes("Bay Area") ||
    resource.counties.includes("National")
  );
}

export function findStaticCommunityResources({
  zip,
  categories,
}: StaticResourceSearchParams): CommunityResourceResults {
  const county = countyFromZip(zip);
  const results: CommunityResourceResults = {};

  for (const category of categories) {
    results[category] = resourceDirectory[category].filter((resource) =>
      matchesCounty(resource, county),
    );
  }

  results.national = resourceDirectory.national;
  return results;
}

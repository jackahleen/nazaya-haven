export type ResourceCategory = "housing" | "food" | "family" | "health" | "community";
export type ResourceCostPath = "insurance" | "free-sliding-scale" | "public-benefit";

export type CuratedResource = {
  id: string;
  name: string;
  category: ResourceCategory;
  costPath: ResourceCostPath;
  description: string;
  counties: readonly string[];
  phone: string;
  website: string;
  bookingUrl?: string;
  languages: readonly string[];
};

export const curatedResources: CuratedResource[] = [
  {
    id: "compass-family-services",
    name: "Compass Family Services",
    category: "housing",
    costPath: "free-sliding-scale",
    description: "Family homelessness prevention, shelter navigation, and housing stabilization.",
    counties: ["San Francisco", "Bay Area"],
    phone: "(415) 644-0504",
    website: "https://www.compass-sf.org/",
    languages: ["English", "Spanish"],
  },
  {
    id: "rams",
    name: "RAMS",
    category: "health",
    costPath: "insurance",
    description: "Community mental health and wellness support with public insurance pathways.",
    counties: ["San Francisco", "Bay Area"],
    phone: "(415) 668-5955",
    website: "https://ramsinc.org/",
    bookingUrl: "https://ramsinc.org/",
    languages: ["English", "Spanish", "Cantonese"],
  },
  {
    id: "bay-area-community-services",
    name: "Bay Area Community Services",
    category: "housing",
    costPath: "free-sliding-scale",
    description: "Housing navigation, behavioral health, and family support services.",
    counties: ["Alameda", "Bay Area"],
    phone: "(510) 613-0330",
    website: "https://www.bayareacs.org/",
    languages: ["English", "Spanish"],
  },
  {
    id: "sf-marin-food-bank",
    name: "San Francisco-Marin Food Bank",
    category: "food",
    costPath: "free-sliding-scale",
    description: "Food pantry lookup, CalFresh support, and family grocery programs.",
    counties: ["San Francisco", "Marin", "Bay Area"],
    phone: "(415) 282-1900",
    website: "https://www.sfmfoodbank.org/",
    languages: ["English", "Spanish"],
  },
  {
    id: "childrens-council-sf",
    name: "Children's Council of San Francisco",
    category: "family",
    costPath: "free-sliding-scale",
    description: "Child care referrals, parenting workshops, and family support resources.",
    counties: ["San Francisco", "Bay Area"],
    phone: "(415) 276-2900",
    website: "https://www.childrenscouncil.org/",
    languages: ["English", "Spanish"],
  },
  {
    id: "family-paths",
    name: "Family Paths",
    category: "community",
    costPath: "free-sliding-scale",
    description: "Parent support hotline, family counseling, and caregiver support programs.",
    counties: ["Alameda", "Bay Area"],
    phone: "1-800-829-3777",
    website: "https://familypaths.org/",
    languages: ["English"],
  },
];

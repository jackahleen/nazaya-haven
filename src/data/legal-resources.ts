export type LegalNeedType =
  | "domestic-violence"
  | "child-abuse"
  | "custody"
  | "child-support"
  | "immigration"
  | "housing"
  | "education"
  | "mental-health"
  | "victim-compensation"
  | "court-forms"
  | "general";

export type CostModel = "Free" | "Sliding Scale" | "Eligibility Required";

export type LegalResource = {
  id: string;
  name: string;
  description: string;
  types: LegalNeedType[];
  countyServed: string[];
  phone: string;
  website: string;
  address: string;
  costModel: CostModel;
  languages: string[];
  hours?: string;
  distanceFromZip?: number;
};

export const legalResources: LegalResource[] = [
  {
    id: "fvlc",
    name: "Family Violence Law Center",
    description:
      "Specialized legal services for domestic violence survivors, including restraining orders, custody modifications, and safety planning.",
    types: ["domestic-violence", "custody", "immigration", "court-forms"],
    countyServed: ["San Francisco", "Alameda"],
    phone: "(415) 362-1900",
    website: "https://www.sfcadv.org/",
    address: "One Oak Street, San Francisco, CA 94102",
    costModel: "Free",
    languages: ["English", "Spanish", "Cantonese", "Vietnamese"],
    hours: "Mon-Fri 9am-5pm",
  },
  {
    id: "bala",
    name: "Bay Area Legal Aid",
    description:
      "Comprehensive legal aid for low-income families, covering domestic violence, custody, housing, immigration, and more.",
    types: ["domestic-violence", "custody", "child-support", "housing", "immigration", "education", "general"],
    countyServed: ["San Francisco", "Alameda", "Marin", "San Mateo"],
    phone: "(415) 861-0033",
    website: "https://www.baylegal.org/",
    address: "1735 Mission Street, Suite 300, San Francisco, CA 94103",
    costModel: "Free",
    languages: ["English", "Spanish", "Cantonese", "Vietnamese", "Mandarin"],
    hours: "Mon-Fri 9am-12pm, 1pm-5pm",
  },
  {
    id: "ccfj",
    name: "Contra Costa Family Justice Center",
    description:
      "Integrated family justice services with domestic violence, custody, child support support, and legal services in one location.",
    types: ["domestic-violence", "custody", "child-support", "child-abuse"],
    countyServed: ["Contra Costa"],
    phone: "(925) 646-1900",
    website: "https://www.co.contra-costa.ca.us/",
    address: "2600 Arnold Industrial Way, Suite 300, Concord, CA 94520",
    costModel: "Free",
    languages: ["English", "Spanish"],
    hours: "Mon-Fri 8am-5pm",
  },
  {
    id: "safequest",
    name: "SafeQuest Solano",
    description:
      "Domestic violence services including legal advocacy, emergency shelter, and counseling for survivors and their children.",
    types: ["domestic-violence", "child-abuse", "mental-health"],
    countyServed: ["Solano"],
    phone: "(707) 422-4357",
    website: "https://www.safequestsolano.org/",
    address: "P.O. Box 3054, Fairfield, CA 94533",
    costModel: "Free",
    languages: ["English", "Spanish"],
    hours: "24/7 Crisis Line",
  },
  {
    id: "sfwar",
    name: "San Francisco Women Against Rape",
    description:
      "Comprehensive support for sexual assault survivors including legal advocacy, counseling, and victim compensation assistance.",
    types: ["victim-compensation", "mental-health", "court-forms"],
    countyServed: ["San Francisco"],
    phone: "(415) 861-2024",
    website: "https://www.sfwar.org/",
    address: "489 Third Street, 2nd Floor, San Francisco, CA 94107",
    costModel: "Free",
    languages: ["English", "Spanish"],
    hours: "Mon-Fri 10am-6pm",
  },
  {
    id: "calico",
    name: "CALICO Child Advocacy Center",
    description:
      "Child-centered support for abuse victims offering forensic interviews, therapy, and coordination with legal/law enforcement.",
    types: ["child-abuse", "victim-compensation", "mental-health"],
    countyServed: ["Alameda"],
    phone: "(510) 452-2500",
    website: "https://www.calicocac.org/",
    address: "3000 Executive Parkway, Suite 300, San Ramon, CA 94583",
    costModel: "Free",
    languages: ["English", "Spanish"],
    hours: "Mon-Fri 8am-5pm",
  },
  {
    id: "lsc",
    name: "Legal Services for Children",
    description:
      "Advocacy and legal representation for children, youth, and families in need of protection, education, and support.",
    types: ["custody", "child-support", "education", "child-abuse", "general"],
    countyServed: ["San Francisco", "Alameda"],
    phone: "(415) 863-3762",
    website: "https://www.lsc-sf.org/",
    address: "1254 Market Street, San Francisco, CA 94102",
    costModel: "Free",
    languages: ["English", "Spanish"],
    hours: "Mon-Fri 9am-5pm",
  },
  {
    id: "sfshc",
    name: "San Francisco Superior Court Self-Help Center",
    description:
      "Free information and guidance on court procedures, forms, and self-representation for family law matters.",
    types: ["court-forms", "custody", "child-support", "domestic-violence"],
    countyServed: ["San Francisco"],
    phone: "(415) 551-4144",
    website: "https://www.sfgov.org/superior-court",
    address: "Civic Center Courthouse, 350 McAllister Street, San Francisco, CA 94102",
    costModel: "Free",
    languages: ["English", "Spanish", "Cantonese"],
    hours: "Mon-Fri 9am-12pm, 1pm-4pm",
  },
  {
    id: "alamedashc",
    name: "Alameda County Family Justice Center",
    description:
      "One-stop resource center with legal services, counseling, and advocacy for families affected by domestic violence.",
    types: ["domestic-violence", "custody", "child-support", "mental-health"],
    countyServed: ["Alameda"],
    phone: "(510) 645-6900",
    website: "https://www.alamedacountylawlibrary.org/",
    address: "2600 Bridger Street, Suite 100, Oakland, CA 94602",
    costModel: "Free",
    languages: ["English", "Spanish", "Vietnamese"],
    hours: "Mon-Fri 9am-5pm",
  },
  {
    id: "ccself",
    name: "California Courts Self-Help Center",
    description:
      "Statewide resource for court forms, videos, and step-by-step guides for family law (DV-100, DV-109, DV-110, etc.).",
    types: ["court-forms", "domestic-violence", "custody", "general"],
    countyServed: ["California-Wide"],
    phone: "(855) 622-2222",
    website: "https://www.courts.ca.gov/selfhelp.htm",
    address: "Online resource center",
    costModel: "Free",
    languages: ["English", "Spanish"],
    hours: "24/7 online",
  },
];

// Labels for legal need types
export const legalNeedLabels: Record<LegalNeedType, string> = {
  "domestic-violence": "Domestic Violence",
  "child-abuse": "Child Abuse",
  custody: "Custody & Visitation",
  "child-support": "Child Support",
  immigration: "Immigration",
  housing: "Housing",
  education: "Education Rights",
  "mental-health": "Mental Health",
  "victim-compensation": "Victim Compensation",
  "court-forms": "Court Forms Help",
  general: "General Legal Help",
};

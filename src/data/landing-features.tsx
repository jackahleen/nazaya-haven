import type { ReactNode } from "react";
import {
  IconAI,
  IconBriefcase,
  IconFeed,
  IconGroups,
  IconJournal,
  IconLegal,
  IconMap,
  IconTeacher,
} from "@/components/icons";

export type FeatureAccent =
  | "lavender"
  | "sky"
  | "mint"
  | "peach"
  | "butter"
  | "rose"
  | "lilac"
  | "purple";

export type LandingFeature = {
  title: string;
  description: string;
  icon: ReactNode;
  accent: FeatureAccent;
  href: string;
  featured?: boolean;
};

export const landingFeatures: LandingFeature[] = [
  {
    title: "Community Feed",
    description:
      "Stories, updates, and encouragement from families and advocates in your circle.",
    icon: <IconFeed />,
    accent: "lavender",
    href: "/dashboard",
  },
  {
    title: "Support Groups",
    description:
      "Moderated groups for parenting, education, wellness, and more — matched to your needs.",
    icon: <IconGroups />,
    accent: "sky",
    href: "/dashboard",
  },
  {
    title: "Jobs & Training",
    description:
      "Career pathways, skill-building workshops, and job listings tailored for caregivers.",
    icon: <IconBriefcase />,
    accent: "mint",
    href: "/dashboard",
  },
  {
    title: "Legal Navigation",
    description:
      "Plain-language guides and referrals for rights, custody, education law, and advocacy.",
    icon: <IconLegal />,
    accent: "peach",
    href: "/dashboard",
  },
  {
    title: "Resources Near You",
    description:
      "Find local clinics, food banks, and community programs near your zip code.",
    icon: <IconMap />,
    accent: "butter",
    href: "/resources",
  },
  {
    title: "Journal",
    description:
      "A private, calm space for reflections, milestones, and notes on your family’s journey.",
    icon: <IconJournal />,
    accent: "rose",
    href: "/dashboard",
  },
  {
    title: "Teacher Mode",
    description:
      "Classroom-friendly tools and resources for educators supporting students and families.",
    icon: <IconTeacher />,
    accent: "lilac",
    href: "/dashboard",
  },
  {
    title: "Nazaya AI Assistant",
    description:
      "Gentle, guided answers about advocacy, next steps, and support — always with care.",
    icon: <IconAI />,
    accent: "purple",
    href: "/dashboard",
    featured: true,
  },
];

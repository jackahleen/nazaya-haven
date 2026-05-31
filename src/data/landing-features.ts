import type { ComponentType } from "react";
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
  Icon: ComponentType;
  accent: FeatureAccent;
  href: string;
  featured?: boolean;
};

export const landingFeatures: LandingFeature[] = [
  {
    title: "Community Feed",
    description:
      "Stories, updates, and encouragement from families and advocates in your circle.",
    Icon: IconFeed,
    accent: "lavender",
    href: "/dashboard",
  },
  {
    title: "Support Groups",
    description:
      "Moderated groups for parenting, education, wellness, and more — matched to your needs.",
    Icon: IconGroups,
    accent: "sky",
    href: "/dashboard",
  },
  {
    title: "Jobs & Training",
    description:
      "Career pathways, skill-building workshops, and job listings tailored for caregivers.",
    Icon: IconBriefcase,
    accent: "mint",
    href: "/dashboard",
  },
  {
    title: "Legal Navigation",
    description:
      "Plain-language guides and referrals for rights, custody, education law, and advocacy.",
    Icon: IconLegal,
    accent: "peach",
    href: "/dashboard",
  },
  {
    title: "Resources Near You",
    description:
      "Local clinics, legal aid, food banks, and community programs on an interactive map.",
    Icon: IconMap,
    accent: "butter",
    href: "/dashboard",
  },
  {
    title: "Journal",
    description:
      "A private, calm space for reflections, milestones, and notes on your family’s journey.",
    Icon: IconJournal,
    accent: "rose",
    href: "/dashboard",
  },
  {
    title: "Teacher Mode",
    description:
      "Classroom-friendly tools and resources for educators supporting students and families.",
    Icon: IconTeacher,
    accent: "lilac",
    href: "/dashboard",
  },
  {
    title: "Nazaya AI Assistant",
    description:
      "Gentle, guided answers about advocacy, next steps, and support — always with care.",
    Icon: IconAI,
    accent: "purple",
    href: "/dashboard",
    featured: true,
  },
];

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
    href: "/community",
  },
  {
    title: "Support Groups",
    description:
      "Moderated groups for parenting, education, wellness, and more — matched to your needs.",
    Icon: IconGroups,
    accent: "sky",
    href: "/groups",
  },
  {
    title: "Jobs & Training",
    description:
      "Career pathways, skill-building workshops, and job listings tailored for caregivers.",
    Icon: IconBriefcase,
    accent: "mint",
    href: "/jobs",
  },
  {
    title: "Legal Navigation",
    description:
      "Plain-language guides and referrals for rights, custody, education law, and advocacy.",
    Icon: IconLegal,
    accent: "peach",
    href: "/legal",
  },
  {
    title: "Resources Near You",
    description:
      "Local clinics, legal aid, food banks, and community programs on an interactive map.",
    Icon: IconMap,
    accent: "butter",
    href: "/resources",
  },
  {
    title: "Journal",
    description:
      "A private, calm space for reflections, milestones, and notes on your family’s journey.",
    Icon: IconJournal,
    accent: "rose",
    href: "/journal",
  },
  {
    title: "Teacher Mode",
    description:
      "Classroom-friendly tools and resources for educators supporting students and families.",
    Icon: IconTeacher,
    accent: "lilac",
    href: "/teacher",
  },
  {
    title: "Nazaya AI Assistant",
    description:
      "Gentle, guided answers about advocacy, next steps, and support — always with care.",
    Icon: IconAI,
    accent: "purple",
    href: "/ai",
    featured: true,
  },
];

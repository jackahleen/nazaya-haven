import Link from "next/link";
import { NazayaChat } from "@/components/chat/NazayaChat";
import { ChildCornerPreview } from "@/components/child/ChildCornerPreview";
import { AuthenticatedUserSummary } from "@/components/dashboard/AuthenticatedUserSummary";
import { DigitalParentingGuide } from "@/components/digital-parenting/DigitalParentingGuide";
import { DashboardCard } from "@/components/DashboardCard";
import { IntegrationReadiness } from "@/components/integrations/IntegrationReadiness";
import {
  IconAI,
  IconFeed,
  IconGroups,
  IconJournal,
  IconLegal,
  IconMap,
  IconTeacher,
} from "@/components/icons";
import { PageShell } from "@/components/PageShell";

const sections = [
  {
    title: "Community Feed",
    description:
      "See updates, stories, and encouragement from families and advocates in your circle.",
    icon: <IconFeed />,
  },
  {
    title: "Support Groups",
    description:
      "Join moderated groups matched to your needs — parenting, education, wellness, and more.",
    icon: <IconGroups />,
  },
  {
    title: "Resources Near You",
    description:
      "Discover local services, clinics, and community programs in your area.",
    icon: <IconMap />,
    href: "/resources",
  },
  {
    title: "Legal Navigation",
    description:
      "Find local legal services for restraining orders, custody, court forms, and family support.",
    icon: <IconLegal />,
    href: "/legal",
  },
  {
    title: "Documents & Forms",
    description:
      "Organize uploads, understand legal form options, and prepare for guided document support.",
    icon: <IconLegal />,
    href: "/documents",
  },
  {
    title: "Journal",
    description:
      "Private reflections and milestones — a calm space to track your family's journey.",
    icon: <IconJournal />,
  },
  {
    title: "Nazaya AI",
    description:
      "Gentle, guided support for questions about advocacy, rights, and next steps — always with care.",
    icon: <IconAI />,
  },
  {
    title: "Digital Parenting Guide",
    description:
      "Build adult tech literacy around internet access, privacy settings, screen-time routines, and guided navigation.",
    icon: <IconTeacher />,
  },
] as const;

export default function DashboardPage() {
  return (
    <PageShell maxWidth="full">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-purple-soft">
            Your haven
          </p>
          <h1 className="mt-1 text-3xl font-semibold text-ink sm:text-4xl">
            Dashboard
          </h1>
          <p className="mt-2 max-w-xl text-ink-muted">
            Everything you need — community, support, resources, reflection, and
            AI guidance — in one welcoming hub.
          </p>
        </div>
        <Link
          href="/dashboard#account"
          className="inline-flex shrink-0 items-center justify-center rounded-full border border-purple/25 bg-lavender-light px-5 py-2.5 text-sm font-semibold text-purple-deep transition hover:bg-lavender"
        >
          Account
        </Link>
      </div>

      <AuthenticatedUserSummary />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <DashboardCard
            key={section.title}
            title={section.title}
            description={section.description}
            icon={section.icon}
            href={"href" in section ? section.href : undefined}
          />
        ))}
      </div>

      <NazayaChat />
      <DigitalParentingGuide />
      <ChildCornerPreview />
      <IntegrationReadiness />

      <p className="mt-10 text-center text-sm text-ink-muted">
        <Link href="/" className="font-medium text-purple hover:text-purple-deep">
          ← Return to Nazaya Haven home
        </Link>
      </p>
    </PageShell>
  );
}

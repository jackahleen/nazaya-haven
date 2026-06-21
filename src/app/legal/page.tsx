"use client";

import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusPill } from "@/components/ui/StatusPill";
import { Surface } from "@/components/ui/Surface";

const resources = [
  {
    name: "San Francisco Superior Court Self-Help Center",
    county: "San Francisco",
    issues: ["family", "custody", "forms", "child-support"],
    description: "Free help with court forms, custody, visitation, child support, and self-representation.",
    phone: "(415) 551-5880",
    website: "https://www.sfsuperiorcourt.org/self-help",
  },
  {
    name: "Bay Area Legal Aid",
    county: "Bay Area",
    issues: ["housing", "family", "public-benefits", "general"],
    description: "Free civil legal help for low-income residents in the Bay Area.",
    phone: "1-800-551-5554",
    website: "https://baylegal.org",
  },
  {
    name: "Legal Aid at Work",
    county: "California",
    issues: ["employment", "education", "general"],
    description: "Legal information and clinics for workers, students, and families.",
    phone: "(415) 864-8848",
    website: "https://legalaidatwork.org",
  },
  {
    name: "Contra Costa Superior Court Self-Help Center",
    county: "Contra Costa",
    issues: ["family", "custody", "forms", "child-support"],
    description: "Court self-help for family law, custody, child support, and court forms.",
    phone: "(925) 608-1000",
    website: "https://www.cc-courts.org/self-help",
  },
];

const issueOptions = [
  { value: "general", label: "General legal aid" },
  { value: "family", label: "Family law" },
  { value: "custody", label: "Custody or visitation" },
  { value: "forms", label: "Court forms" },
  { value: "child-support", label: "Child support" },
  { value: "housing", label: "Housing legal help" },
  { value: "immigration", label: "Immigration legal help" },
  { value: "education", label: "Education or school rights" },
];

function countyFromZip(zip: string) {
  if (zip.startsWith("941")) return "San Francisco";
  if (zip.startsWith("945") || zip.startsWith("948")) return "Contra Costa";
  return "";
}

export default function LegalNavigationPage() {
  const [issue, setIssue] = useState("general");
  const [zip, setZip] = useState("");
  const county = countyFromZip(zip);

  const filteredResources = resources.filter((resource) => {
    const matchesIssue =
      resource.issues.includes(issue) || resource.issues.includes("general");
    const matchesCounty =
      !county ||
      resource.county === county ||
      resource.county === "Bay Area" ||
      resource.county === "California";

    return matchesIssue && matchesCounty;
  });

  return (
    <PageShell maxWidth="xl">
      <div className="space-y-10 py-8">
        <Surface className="bg-lavender-light">
          <SectionHeader
            eyebrow="Resources"
            title="Legal Navigation"
            description="Find legal resources, organize exhibits, and get help preparing legal forms. Nazaya Haven provides general information and resource navigation, not legal advice."
          />
        </Surface>

        <section className="grid gap-5 md:grid-cols-3">
          <Surface className="rounded-2xl">
            <h2 className="text-xl font-semibold text-ink">
              Find Legal Resources
            </h2>
            <p className="mt-2 text-ink-muted">
              Search by legal issue and ZIP code. Results stay on this same page.
            </p>
          </Surface>

          <Surface className="rounded-2xl">
            <h2 className="text-xl font-semibold text-ink">
              AI Exhibit Organizer
            </h2>
            <p className="mt-2 text-ink-muted">
              Organize evidence, documents, screenshots, photos, and records into exhibits.
            </p>
            <div className="mt-4">
              <StatusPill tone="lavender">Coming Soon</StatusPill>
            </div>
          </Surface>

          <Surface className="rounded-2xl">
            <h2 className="text-xl font-semibold text-ink">
              AI Legal Form Assistant
            </h2>
            <p className="mt-2 text-ink-muted">
              Answer plain-language questions and get help preparing court form drafts.
            </p>
            <div className="mt-4">
              <StatusPill tone="lavender">Coming Soon</StatusPill>
            </div>
          </Surface>
        </section>

        <Surface>
          <h2 className="text-2xl font-semibold text-ink">
            Find Legal Resources
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="font-semibold text-ink">Legal issue</span>
              <select
                value={issue}
                onChange={(event) => setIssue(event.target.value)}
                className="mt-2 w-full rounded-xl border border-lavender-deep/50 bg-cream-dark/80 p-3 text-ink focus:border-purple focus:outline-none"
              >
                {issueOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="font-semibold text-ink">ZIP code</span>
              <input
                value={zip}
                onChange={(event) => setZip(event.target.value)}
                placeholder="Example: 94102"
                maxLength={5}
                className="mt-2 w-full rounded-xl border border-lavender-deep/50 bg-cream-dark/80 p-3 text-ink focus:border-purple focus:outline-none"
              />
            </label>
          </div>

          {county && (
            <p className="mt-4 text-sm text-ink-muted">
              Showing resources near: <span className="font-semibold">{county}</span>
            </p>
          )}

          <div className="mt-6 space-y-4">
            {filteredResources.map((resource) => (
              <div
                key={resource.name}
                className="rounded-2xl border border-lavender-deep/40 bg-lavender-light p-5"
              >
                <h3 className="text-xl font-semibold text-ink">{resource.name}</h3>
                <p className="mt-2 text-ink-muted">{resource.description}</p>
                <p className="mt-3 text-sm text-ink-muted">
                  County/Area: {resource.county}
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <a
                    href={`tel:${resource.phone}`}
                    className="rounded-full bg-purple px-4 py-2 font-semibold text-cream"
                  >
                    Call {resource.phone}
                  </a>
                  <a
                    href={resource.website}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-purple px-4 py-2 font-semibold text-purple"
                  >
                    Visit Website
                  </a>
                </div>
              </div>
            ))}
          </div>
        </Surface>

        <section className="rounded-2xl bg-pastel-butter/70 p-5 text-sm text-ink-muted">
          <strong>Important:</strong> Nazaya Haven gives general information and
          resource navigation only. It is not a lawyer and does not provide legal
          advice. For legal advice, contact a qualified attorney or legal aid
          organization.
        </section>
      </div>
    </PageShell>
  );
}

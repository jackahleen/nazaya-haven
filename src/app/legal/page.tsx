"use client";

import { useState, useMemo } from "react";
import { PageShell } from "@/components/PageShell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusPill } from "@/components/ui/StatusPill";
import { Surface } from "@/components/ui/Surface";
import { LegalSearch, type SearchParams } from "@/components/legal/LegalSearch";
import { LegalResources } from "@/components/legal/LegalResources";
import { EmergencyHotlines } from "@/components/legal/EmergencyHotlines";
import { findMatchingResources } from "@/utils/findMatchingResources";
import { zipCodeToCounty } from "@/utils/zipCodeToCounty";

export default function LegalNavigationPage() {
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null);

  const matchedResources = useMemo(() => {
    if (!searchParams) return [];
    return findMatchingResources({
      zipCode: searchParams.zipCode,
      needType: searchParams.needType,
      language: searchParams.language,
    });
  }, [searchParams]);

  const handleSearch = (params: SearchParams) => {
    setSearchParams(params);
    const county = zipCodeToCounty(params.zipCode);
    setSelectedCounty(county);
  };

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
          <h2 className="text-2xl font-semibold text-ink mb-6">
            Find Legal Resources
          </h2>
          <LegalSearch onSearch={handleSearch} />
        </Surface>

        {searchParams && (
          <div className="space-y-6">
            <LegalResources
              resources={matchedResources}
              isLoading={false}
              selectedCounty={selectedCounty || undefined}
            />
          </div>
        )}

        <EmergencyHotlines />

        <section className="rounded-2xl bg-pastel-butter/70 p-5 text-sm text-ink-muted">
          <strong>Important:</strong> Nazaya Haven provides general information and
          resource navigation only. It is not a lawyer and does not provide legal
          advice. For legal advice, contact a qualified attorney or legal aid
          organization.
        </section>
      </div>
    </PageShell>
  );
}

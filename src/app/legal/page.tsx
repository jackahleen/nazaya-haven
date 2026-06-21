"use client";

import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { LegalSearch, type SearchParams } from "@/components/legal/LegalSearch";
import { LegalResources } from "@/components/legal/LegalResources";
import { EmergencyHotlines } from "@/components/legal/EmergencyHotlines";
import { SupportWizard, type WizardAnswers } from "@/components/legal/SupportWizard";
import { findMatchingResources } from "@/utils/findMatchingResources";
import { zipCodeToCounty } from "@/utils/zipCodeToCounty";
import { type LegalResource } from "@/data/legal-resources";

const needOptions = [
  { value: "family-law", label: "Family law help" },
  { value: "custody", label: "Custody or visitation help" },
  { value: "housing", label: "Housing legal help" },
  { value: "immigration", label: "Immigration legal help" },
  { value: "education", label: "Education or school rights help" },
  { value: "forms", label: "Court forms help" },
  { value: "general", label: "General legal aid" },
] as const;

export default function LegalNavigationPage() {
  const [wizardComplete, setWizardComplete] = useState(false);
  const [wizardAnswers, setWizardAnswers] = useState<WizardAnswers | null>(null);
  const [searchResults, setSearchResults] = useState<LegalResource[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCounty, setSelectedCounty] = useState<string>();

  const handleWizardComplete = (answers: WizardAnswers) => {
    setWizardAnswers(answers);
    setWizardComplete(true);
    // Auto-search with wizard answers
    handleWizardSearch(answers);
  };

  const handleWizardSearch = (answers: WizardAnswers) => {
    setIsLoading(true);

    setTimeout(() => {
      const results = findMatchingResources({
        zipCode: answers.zipCode,
        needType: answers.needType,
      });

      const county = zipCodeToCounty(answers.zipCode);
      setSelectedCounty(county || undefined);

      // Prioritize by urgency
      const prioritized = prioritizeByUrgency(results, answers.urgency);
      setSearchResults(prioritized);
      setHasSearched(true);
      setIsLoading(false);
    }, 300);
  };

  const handleSearch = (params: SearchParams) => {
    setIsLoading(true);

    setTimeout(() => {
      const results = findMatchingResources({
        zipCode: params.zipCode,
        needType: params.needType,
        language: params.language !== "Any" ? params.language : undefined,
      });

      const county = zipCodeToCounty(params.zipCode);
      setSelectedCounty(county || undefined);
      setSearchResults(results);
      setHasSearched(true);
      setIsLoading(false);
    }, 300);
  };

  const prioritizeByUrgency = (resources: LegalResource[], urgency: string): LegalResource[] => {
    if (urgency === "emergency") {
      // Put crisis resources first (24/7 or emergency services)
      return resources.sort((a, b) => {
        const aIs24_7 = a.hours?.includes("24/7") ? 0 : 1;
        const bIs24_7 = b.hours?.includes("24/7") ? 0 : 1;
        return aIs24_7 - bIs24_7;
      });
    }
    return resources;
  };

  return (
    <PageShell maxWidth="xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-purple-soft">
            Resources
          </p>
          <h1 className="mt-1 text-3xl font-semibold text-ink sm:text-4xl">
            Legal Navigation
          </h1>
          <p className="mt-2 max-w-xl text-ink-muted">
            Find local legal services for your family. We're here to help with restraining orders, custody matters, court forms, and more.
          </p>
        </div>
      </div>

     

      {/* Support Wizard - Show first */}
      {!wizardComplete && (
        <div className="mb-8">
          <SupportWizard onComplete={handleWizardComplete} />
        </div>
      )}

      {/* If wizard complete - show results header */}
      {wizardComplete && wizardAnswers && (
        <div className="mb-8 rounded-lg border border-purple/20 bg-purple/5 p-4">
          <p className="text-sm text-ink-muted">
            Based on your needs:{" "}
            <span className="font-semibold text-ink">
              {needOptions.find((o) => o.value === wizardAnswers.needType)?.label}
            </span>
            {wizardAnswers.urgency === "emergency" && (
              <span className="ml-2 inline-block rounded-full bg-pastel-rose/20 px-2 py-1 text-xs font-semibold text-pastel-rose">
                🚨 URGENT
              </span>
            )}
          </p>
          <button
            onClick={() => setWizardComplete(false)}
            className="mt-2 text-sm text-purple hover:text-purple-deep"
          >
            ← Start over with different answers
          </button>
        </div>
      )}

      {/* Legal Disclaimer */}
      {wizardComplete && (
        <div className="mb-8 rounded-2xl border border-pastel-rose/30 bg-pastel-rose/5 p-6">
          <p className="text-sm leading-relaxed text-ink-muted">
            <strong className="text-ink">⚠️ Important Disclaimer:</strong> Nazaya Haven provides general information and resource navigation, not legal advice. Always consult with qualified attorneys for specific legal guidance, especially in matters involving domestic violence, custody, or family law.
          </p>
        </div>
      )}

      {/* Main Content Grid - Only show after wizard */}
      {wizardComplete && (
        <div className="grid gap-8 lg:grid-cols-3">
        {/* Search Form - Sticky on larger screens */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-lavender-deep/40 bg-cream-dark/80 p-6 lg:sticky lg:top-6">
            <h2 className="mb-4 text-lg font-semibold text-ink">Find Resources</h2>
            <LegalSearch onSearch={handleSearch} isLoading={isLoading} />
          </div>
        </div>

        {/* Results - Takes up 2 columns */}
        <div className="lg:col-span-2">
          {hasSearched ? (
            <LegalResources
              resources={searchResults}
              isLoading={isLoading}
              selectedCounty={selectedCounty}
            />
          ) : (
            <div className="rounded-2xl border border-lavender-deep/40 bg-lavender-light/40 p-8 text-center">
              <h3 className="text-lg font-semibold text-ink">Start Your Search</h3>
              <p className="mt-2 text-ink-muted">
                Enter your ZIP code above to find legal resources in your area.
              </p>
              <p className="mt-4 text-sm text-ink-muted">
                <strong>Tip:</strong> We have resources covering domestic violence, child abuse, custody, child support, immigration, housing, education rights, mental health, and victim compensation.
              </p>
            </div>
          )}
        </div>
      </div>
      )}

      {/* Understanding Help Categories - Reference Section */}
      {wizardComplete && (
        <>
          <section className="mt-12 rounded-2xl border border-purple/20 bg-purple/5 p-8">
            <h2 className="text-xl font-semibold text-ink">Understanding Your Legal Needs</h2>
            <p className="mt-2 text-ink-muted">
              We can help connect you with resources in these areas:
            </p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {[
                { emoji: "💜", title: "Domestic Violence", desc: "Restraining orders, safety planning" },
                { emoji: "🤕", title: "Child Abuse", desc: "Reporting, advocacy, counseling" },
                { emoji: "👨‍👩‍👧", title: "Custody & Visitation", desc: "Custody arrangements, modifications" },
                { emoji: "💰", title: "Child Support", desc: "Support calculations, modifications" },
                { emoji: "🌍", title: "Immigration", desc: "Family-related immigration support" },
                { emoji: "🏠", title: "Housing", desc: "Legal aid for housing issues" },
                { emoji: "📚", title: "Education Rights", desc: "Special education, school issues" },
                { emoji: "💭", title: "Mental Health", desc: "Counseling & mental health support" },
                { emoji: "🛡️", title: "Victim Compensation", desc: "Crime victim assistance programs" },
              ].map((item) => (
                <div key={item.title} className="rounded-lg bg-white/40 p-3">
                  <p className="text-sm font-semibold text-ink">{item.emoji} {item.title}</p>
                  <p className="text-xs text-ink-muted mt-1">{item.desc}</p>
                </div>
              ))}
            </ul>
          </section>

          {/* DV Forms Guide - Static Reference Section */}
          <section className="mt-8 rounded-2xl border border-lavender-deep/40 bg-lavender-light/40 p-8">
            <h2 className="text-xl font-semibold text-ink">Domestic Violence Court Forms</h2>
            <p className="mt-2 text-ink-muted">
              If you're seeking a domestic violence restraining order, California courts use standard forms:
            </p>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple/20 text-sm font-semibold text-purple">
                  1
                </span>
                <div>
                  <p className="font-medium text-ink">DV-100: Request for Domestic Violence Restraining Order</p>
                  <p className="text-sm text-ink-muted">The initial petition form you file with the court.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple/20 text-sm font-semibold text-purple">
                  2
                </span>
                <div>
                  <p className="font-medium text-ink">DV-109: Temporary Restraining Order</p>
                  <p className="text-sm text-ink-muted">Emergency protection issued without a hearing (14-day protection).</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple/20 text-sm font-semibold text-purple">
                  3
                </span>
                <div>
                  <p className="font-medium text-ink">DV-110: Domestic Violence Restraining Order</p>
                  <p className="text-sm text-ink-muted">Final order issued after a hearing (up to 5 years of protection).</p>
                </div>
              </li>
            </ul>
            <p className="mt-4 text-sm text-ink-muted">
              Visit <a href="https://www.courts.ca.gov/selfhelp.htm" target="_blank" rel="noopener noreferrer" className="font-medium text-purple hover:text-purple-deep">California Courts Self-Help Center</a> to download these forms with step-by-step instructions.
            </p>
          </section>
        </>
      )}

      {/* Footer */}
      <p className="mt-12 text-center">
        <a href="/dashboard" className="text-sm text-ink-muted hover:text-purple">
          ← Return to Dashboard
        </a>
      </p>
    </PageShell>
  );
}

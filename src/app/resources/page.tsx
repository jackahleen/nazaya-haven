"use client";

import { useState } from "react";
import {
  type CommunityResource,
  type CommunityResourceCategory,
  type CommunityResourceResults,
} from "@/data/community-resources";
import { PageShell } from "@/components/PageShell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusPill } from "@/components/ui/StatusPill";
import { Surface } from "@/components/ui/Surface";
import { ResourceHandoffButton } from "@/components/agents/ResourceHandoffButton";
import { VoiceIntakeWidget } from "@/components/voice/VoiceIntakeWidget";
import {
  getDemoCommunityResourceResults,
  resourceDemoModeNotice,
} from "@/lib/resources/demo-resource-search";
import { isStaticNazayaRuntime } from "@/lib/runtime/nazaya-runtime";

const CATEGORIES: { id: CommunityResourceCategory; label: string }[] = [
  { id: "housing", label: "Housing" },
  { id: "food", label: "Food Insecurity" },
  { id: "family", label: "Family Care" },
  { id: "health", label: "Mental & Physical Health" },
  { id: "community", label: "Community Support" },
] as const;

const CATEGORY_LABELS: Record<CommunityResourceCategory | "national", string> = {
  housing: "Housing",
  food: "Food Insecurity",
  family: "Family Care",
  health: "Mental & Physical Health",
  community: "Community Support",
  national: "National Resources",
};

export default function ResourcesPage() {
  const [zip, setZip] = useState("");
  const [selected, setSelected] = useState<CommunityResourceCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fallbackNotice, setFallbackNotice] = useState("");
  const [results, setResults] = useState<CommunityResourceResults | null>(null);
  const isDemoMode = isStaticNazayaRuntime();

  function toggleCategory(id: CommunityResourceCategory) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  function showStaticPreviewResults() {
    setFallbackNotice(resourceDemoModeNotice);
    setResults(getDemoCommunityResourceResults({ zip, categories: selected }));
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setFallbackNotice("");
    setResults(null);

    if (selected.length === 0) {
      setError("Please select at least one category.");
      return;
    }
    if (!/^\d{5}$/.test(zip)) {
      setError("Please enter a valid 5-digit zip code.");
      return;
    }

    if (isDemoMode) {
      showStaticPreviewResults();
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zip, categories: selected }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(
          typeof data.error === "string"
            ? data.error
            : "Live resource search is unavailable."
        );
        return;
      }
      setResults(data as CommunityResourceResults);
    } catch {
      setError("Live resource search is unavailable.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell maxWidth="full">
      <Surface className="bg-lavender-light">
        <SectionHeader
          eyebrow="Resources"
          title="Resources Near You"
          description="Tell us what you need help with and your zip code, and we'll find local and national resources for you."
        />
      </Surface>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <form onSubmit={handleSearch} className="space-y-6 lg:col-span-2">
          <div className="flex flex-wrap gap-2">
            {isDemoMode && <StatusPill tone="butter">Demo mode</StatusPill>}
            <StatusPill tone="mint">Insurance path</StatusPill>
            <StatusPill tone="butter">Free or sliding-scale path</StatusPill>
          </div>
          <div>
            <p className="mb-3 text-sm font-medium text-ink">
              What do you need help with?
            </p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => {
                const active = selected.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className={`rounded-full border-2 px-4 py-2 text-sm font-medium transition ${
                      active
                        ? "border-purple bg-purple text-cream"
                        : "border-lavender-deep/50 bg-cream text-ink hover:border-purple/50"
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label htmlFor="zip" className="mb-2 block text-sm font-medium text-ink">
              Zip code
            </label>
            <div className="flex max-w-sm gap-2">
              <input
                id="zip"
                type="text"
                inputMode="numeric"
                maxLength={5}
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                placeholder="Enter zip code"
                className="flex-1 rounded-full border-2 border-lavender-deep/50 bg-cream px-5 py-3 text-base text-ink focus:border-purple focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-purple px-6 py-3 text-sm font-semibold text-cream transition hover:bg-purple-deep disabled:opacity-60"
              >
                {loading ? "Searching…" : "Search"}
              </button>
            </div>
          </div>
        </form>

        <div>
          <VoiceIntakeWidget
            onTranscriptChange={() => {}}
            placeholder="Speak to describe your needs..."
          />
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      {fallbackNotice && (
        <p className="mt-4 max-w-2xl rounded-2xl bg-pastel-butter/70 px-4 py-3 text-sm text-ink-muted">
          {fallbackNotice}
        </p>
      )}

      {results && (
        <div className="mt-10 space-y-10">
          {Object.entries(results).map(([key, items]) =>
            items && items.length > 0 ? (
              <section key={key}>
                <h2 className="text-xl font-semibold text-ink">
                  {CATEGORY_LABELS[key as keyof typeof CATEGORY_LABELS] ?? key}
                </h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {items.map((r, i) => (
                    <ResourceCard
                      key={i}
                      resource={r}
                      category={key as CommunityResourceCategory | "national"}
                    />
                  ))}
                </div>
              </section>
            ) : null
          )}
        </div>
      )}
    </PageShell>
  );
}

interface ResourceCardProps {
  resource: CommunityResource;
  category: CommunityResourceCategory | "national";
}

function ResourceCard({ resource, category }: ResourceCardProps) {
  return (
    <article className="rounded-2xl border border-lavender-deep/40 bg-cream-dark/80 p-5">
      <h3 className="font-semibold text-ink">{resource.name}</h3>
      <p className="mt-1 text-sm text-ink-muted">{resource.description}</p>
      {resource.address && (
        <p className="mt-2 text-sm text-ink-muted">{resource.address}</p>
      )}
      {resource.phone && (
        <p className="mt-1 text-sm text-ink-muted">{resource.phone}</p>
      )}
      {resource.website && (
        <a
          href={resource.website}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-sm font-medium text-purple hover:text-purple-deep"
        >
          Visit website →
        </a>
      )}
      <p className="mt-2 text-sm font-medium text-purple-deep">
        Booking support available through the resource website
      </p>
      <div className="mt-4 border-t border-lavender-deep/20 pt-4">
        <ResourceHandoffButton
          resourceName={resource.name}
          category={category}
        />
      </div>
    </article>
  );
}

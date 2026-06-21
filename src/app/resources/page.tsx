"use client";

import { useState } from "react";
import { PageShell } from "@/components/PageShell";

type Resource = {
  name: string;
  description: string;
  phone: string;
  website: string;
  address?: string;
};

type ResourceResults = {
  [key: string]: Resource[];
};

const CATEGORIES = [
  { id: "housing", label: "Housing" },
  { id: "food", label: "Food Insecurity" },
  { id: "family", label: "Family Care" },
  { id: "health", label: "Mental & Physical Health" },
  { id: "community", label: "Community Support" },
] as const;

const CATEGORY_LABELS: Record<string, string> = {
  housing: "Housing",
  food: "Food Insecurity",
  family: "Family Care",
  health: "Mental & Physical Health",
  community: "Community Support",
  national: "National Resources",
};

export default function ResourcesPage() {
  const [zip, setZip] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState<ResourceResults | null>(null);

  function toggleCategory(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResults(null);

    if (selected.length === 0) {
      setError("Please select at least one category.");
      return;
    }
    if (!/^\d{5}$/.test(zip)) {
      setError("Please enter a valid 5-digit zip code.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zip, categories: selected }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
      setResults(data);
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell maxWidth="full">
      <h1 className="text-3xl font-semibold text-ink sm:text-4xl">
        Resources Near You
      </h1>
      <p className="mt-2 max-w-xl text-ink-muted">
        Tell us what you need help with and your zip code, and we&apos;ll find
        local and national resources for you.
      </p>

      <form onSubmit={handleSearch} className="mt-8 max-w-2xl space-y-6">
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

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {results && (
        <div className="mt-10 space-y-10">
          {Object.entries(results).map(([key, items]) =>
            items.length > 0 ? (
              <section key={key}>
                <h2 className="text-xl font-semibold text-ink">
                  {CATEGORY_LABELS[key] ?? key}
                </h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {items.map((r, i) => (
                    <ResourceCard key={i} resource={r} />
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

function ResourceCard({ resource }: { resource: Resource }) {
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
    </article>
  );
}
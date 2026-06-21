"use client";

import { type LegalResource } from "@/data/legal-resources";
import { LegalResourceCard } from "./LegalResourceCard";

type LegalResourcesProps = {
  resources: LegalResource[];
  isLoading: boolean;
  selectedCounty?: string;
};

export function LegalResources({
  resources,
  isLoading,
  selectedCounty,
}: LegalResourcesProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-48 rounded-2xl border border-lavender-deep/40 bg-cream-dark/80 p-6 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (resources.length === 0) {
    return (
      <div className="rounded-2xl border border-lavender-deep/40 bg-lavender-light/40 p-8 text-center">
        <h3 className="text-lg font-semibold text-ink">No resources found</h3>
        <p className="mt-2 text-ink-muted">
          {selectedCounty
            ? `We don't have resources in ${selectedCounty} County that match your criteria yet.`
            : "Please search with a valid ZIP code to find resources."}
        </p>
        <p className="mt-4 text-sm text-ink-muted">
          <strong>Tip:</strong> Try selecting "Browse all resources" to see everything available in your area.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-purple/20 bg-purple/5 p-4">
        <p className="text-sm font-medium text-purple-deep">
          Found {resources.length} resource{resources.length !== 1 ? "s" : ""}{" "}
          {selectedCounty && `in ${selectedCounty} County`}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {resources.map((resource) => (
          <LegalResourceCard 
            key={resource.id} 
            resource={resource}
            userCounty={selectedCounty}
          />
        ))}
      </div>
    </div>
  );
}

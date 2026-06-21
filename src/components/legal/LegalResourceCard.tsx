"use client";

import { type LegalNeedType, legalNeedLabels, type LegalResource } from "@/data/legal-resources";

type LegalResourceCardProps = {
  resource: LegalResource;
  userCounty?: string;
};

function getDistanceBadge(resource: LegalResource, userCounty?: string) {
  if (!userCounty) return null;

  if (resource.countyServed.includes("California-Wide")) {
    return { label: "Statewide", color: "bg-sky/10 text-sky-deep", dot: "🔵" };
  }

  if (resource.countyServed.includes(userCounty)) {
    return { label: "Within County", color: "bg-mint/10 text-mint-deep", dot: "🟢" };
  }

  return { label: "Nearby County", color: "bg-butter/10 text-butter-deep", dot: "🟡" };
}

export function LegalResourceCard({ resource, userCounty }: LegalResourceCardProps) {
  const distanceBadge = getDistanceBadge(resource, userCounty);

  const handleCall = () => {
    // Remove non-numeric characters from phone for tel: link
    const phoneDigits = resource.phone.replace(/\D/g, "");
    window.location.href = `tel:+1${phoneDigits}`;
  };

  const handleWebsite = () => {
    window.open(resource.website, "_blank", "noopener,noreferrer");
  };

  return (
    <article className="flex flex-col rounded-2xl border border-lavender-deep/40 bg-cream-dark/80 p-6 shadow-sm transition hover:border-purple/30 hover:shadow-md hover:shadow-purple/10">
      {/* Header: Organization Name + Distance Badge */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="flex-1 text-lg font-semibold text-ink">{resource.name}</h3>
        {distanceBadge && (
          <span className={`${distanceBadge.color} shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium`}>
            {distanceBadge.dot} {distanceBadge.label}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-sm leading-relaxed text-ink-muted">{resource.description}</p>

      {/* Legal Need Types - Tags */}
      <div className="mt-4 flex flex-wrap gap-2">
        {resource.types.map((type) => (
          <span
            key={type}
            className="rounded-full bg-purple/10 px-3 py-1 text-xs font-medium text-purple-deep"
          >
            {legalNeedLabels[type as LegalNeedType]}
          </span>
        ))}
      </div>

      {/* Info Grid */}
      <div className="mt-5 space-y-3 border-t border-lavender-deep/20 pt-4 text-sm">
        {/* Area Served */}
        <div>
          <p className="font-medium text-ink">Area Served</p>
          <p className="text-ink-muted">{resource.countyServed.join(", ")}</p>
        </div>

        {/* Address */}
        {resource.address && !resource.address.includes("Online") && (
          <div>
            <p className="font-medium text-ink">Address</p>
            <p className="text-ink-muted">{resource.address}</p>
          </div>
        )}

        {/* Cost Model */}
        <div>
          <p className="font-medium text-ink">Cost</p>
          <p className="text-ink-muted">{resource.costModel}</p>
        </div>

        {/* Languages */}
        <div>
          <p className="font-medium text-ink">Languages</p>
          <p className="text-ink-muted">{resource.languages.join(", ")}</p>
        </div>

        {/* Hours */}
        {resource.hours && (
          <div>
            <p className="font-medium text-ink">Hours</p>
            <p className="text-ink-muted">{resource.hours}</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={handleCall}
          className="flex-1 rounded-full bg-purple px-4 py-2.5 text-sm font-semibold text-cream shadow-md shadow-purple/25 transition hover:bg-purple-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
        >
          📞 Call
        </button>
        <button
          onClick={handleWebsite}
          className="flex-1 rounded-full border-2 border-purple/30 bg-lavender-light px-4 py-2.5 text-sm font-semibold text-purple-deep transition hover:border-purple/50 hover:bg-lavender focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-soft focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
        >
          🌐 Website
        </button>
      </div>

      {/* Phone Number Display for Reference */}
      <p className="mt-3 text-center text-xs text-ink-muted">
        {resource.phone}
      </p>
    </article>
  );
}

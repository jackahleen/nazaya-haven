import Link from "next/link";
import type { LandingFeature } from "@/data/landing-features";

const accentStyles: Record<
  LandingFeature["accent"],
  { card: string; icon: string; ring: string }
> = {
  lavender: {
    card: "bg-lavender-light/90 border-lavender-deep/50",
    icon: "bg-lavender text-purple-deep",
    ring: "focus-visible:ring-lavender-deep",
  },
  sky: {
    card: "bg-pastel-sky/90 border-pastel-sky",
    icon: "bg-pastel-sky text-purple-deep",
    ring: "focus-visible:ring-purple-soft",
  },
  mint: {
    card: "bg-pastel-mint/90 border-pastel-mint",
    icon: "bg-pastel-mint text-purple-deep",
    ring: "focus-visible:ring-purple-soft",
  },
  peach: {
    card: "bg-pastel-peach/90 border-pastel-peach",
    icon: "bg-pastel-peach text-purple-deep",
    ring: "focus-visible:ring-purple-soft",
  },
  butter: {
    card: "bg-pastel-butter/90 border-pastel-butter",
    icon: "bg-pastel-butter text-purple-deep",
    ring: "focus-visible:ring-purple-soft",
  },
  rose: {
    card: "bg-pastel-rose/90 border-pastel-rose",
    icon: "bg-pastel-rose text-purple-deep",
    ring: "focus-visible:ring-purple-soft",
  },
  lilac: {
    card: "bg-pastel-lilac/90 border-pastel-lilac",
    icon: "bg-pastel-lilac text-purple-deep",
    ring: "focus-visible:ring-purple-soft",
  },
  purple: {
    card: "bg-gradient-to-br from-lavender-light via-lavender to-lavender-deep/40 border-purple/25",
    icon: "bg-purple text-cream shadow-sm shadow-purple/30",
    ring: "focus-visible:ring-purple",
  },
};

type FeatureCardProps = {
  feature: LandingFeature;
};

export function FeatureCard({ feature }: FeatureCardProps) {
  const styles = accentStyles[feature.accent];

  return (
    <Link
      href={feature.href}
      className={`group flex h-full flex-col rounded-3xl border p-6 shadow-md shadow-purple/5 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-cream ${styles.card} ${styles.ring}`}
    >
      <div
        className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl transition group-hover:scale-105 ${styles.icon}`}
      >
        {feature.icon}
      </div>
      <h3 className="text-lg font-semibold text-ink">{feature.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">
        {feature.description}
      </p>
      <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-purple group-hover:text-purple-deep">
        Explore
        <span aria-hidden>→</span>
      </span>
    </Link>
  );
}

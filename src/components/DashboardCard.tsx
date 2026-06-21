import type { ReactNode } from "react";

type DashboardCardProps = {
  title: string;
  description: string;
  icon: ReactNode;
};

export function DashboardCard({ title, description, icon }: DashboardCardProps) {
  return (
    <article className="group flex flex-col rounded-2xl border border-lavender-deep/40 bg-cream-dark/80 p-6 shadow-sm transition hover:border-purple/30 hover:shadow-md hover:shadow-purple/10">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-lavender text-purple-deep transition group-hover:bg-purple group-hover:text-cream">
        {icon}
      </div>
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">
        {description}
      </p>
      <span className="mt-4 text-sm font-medium text-purple group-hover:text-purple-deep">
        Open →
      </span>
    </article>
  );
}

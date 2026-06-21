import type { ReactNode } from "react";

type SurfaceProps = {
  children: ReactNode;
  className?: string;
};

export function Surface({ children, className = "" }: SurfaceProps) {
  return (
    <section
      className={`rounded-3xl border border-lavender-deep/40 bg-cream p-5 shadow-sm sm:p-6 ${className}`}
    >
      {children}
    </section>
  );
}

import type { ReactNode } from "react";
import { BrandLogo } from "./BrandLogo";

type PageShellProps = {
  children: ReactNode;
  showBrand?: boolean;
  maxWidth?: "md" | "lg" | "xl" | "full";
};

const widthClass = {
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-5xl",
  full: "max-w-6xl",
};

export function PageShell({
  children,
  showBrand = true,
  maxWidth = "xl",
}: PageShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-lavender/80 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-lavender-deep/40 blur-3xl"
        aria-hidden
      />

      <header className="relative z-10 border-b border-lavender-deep/30 bg-cream/80 px-6 py-5 backdrop-blur-sm">
        <div className={`mx-auto ${widthClass.full} flex items-center justify-between`}>
          {showBrand ? <BrandLogo size="sm" /> : <div />}
        </div>
      </header>

      <main
        className={`relative z-10 mx-auto px-6 py-10 sm:py-14 ${widthClass[maxWidth]}`}
      >
        {children}
      </main>
    </div>
  );
}

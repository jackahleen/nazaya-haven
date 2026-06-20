import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Resources", href: "/dashboard" },
  { label: "Sign In", href: "/login" },
] as const;

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-lavender-deep/30 bg-cream/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-6">
        <BrandLogo href="/" size="sm" />
        <nav aria-label="Main navigation">
          <ul className="flex items-center gap-1 sm:gap-2">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className={`rounded-full px-3 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple focus-visible:ring-offset-2 focus-visible:ring-offset-cream sm:px-4 ${
                    link.label === "Sign In"
                      ? "bg-purple text-cream shadow-sm shadow-purple/20 hover:bg-purple-deep"
                      : "text-ink-muted hover:bg-lavender/60 hover:text-ink"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

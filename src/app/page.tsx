import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/Button";
import { HeroSearch } from "@/components/landing/HeroSearch";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeader } from "@/components/landing/LandingHeader";

export default function HomePage() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-purple focus:px-4 focus:py-2 focus:text-cream"
      >
        Skip to main content
      </a>

      <div className="relative min-h-screen overflow-x-hidden">
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-lavender-light via-cream to-cream"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-40 top-20 h-[420px] w-[420px] rounded-full bg-lavender/70 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-32 top-1/3 h-80 w-80 rounded-full bg-pastel-rose/80 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-lavender-deep/30 blur-3xl"
          aria-hidden
        />

        <LandingHeader />

        <main id="main-content" className="relative z-10">
          {/* Hero */}
          <section
            aria-labelledby="hero-heading"
            className="mx-auto max-w-6xl px-5 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-14"
          >
            <div className="flex flex-col items-center text-center">
              <div className="mb-8">
                <BrandLogo href="/" size="hero" layout="stacked" />
              </div>

              <h1
                id="hero-heading"
                className="max-w-3xl text-2xl font-semibold leading-snug text-ink sm:text-3xl md:text-4xl"
              >
                A Safe Place. A Stronger Future. Together.
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">
                Your haven for community, support, legal guidance, local
                resources, and caring AI — designed for families and children
                with warmth and trust.
              </p>

              <div className="mt-10 w-full">
                <HeroSearch />
              </div>

              <div className="mt-10 flex w-full max-w-md flex-col gap-4 sm:max-w-none sm:flex-row sm:justify-center">
                <Button href="/dashboard" variant="primary" className="w-full sm:w-auto">
                  Get Started
                </Button>
              </div>

              <p className="mt-8 text-sm text-ink-muted">
                Trusted by families, educators, and advocates nationwide.
              </p>
            </div>
          </section>

          {/* Trust strip */}
          <section
            aria-label="Platform highlights"
            className="mx-auto max-w-6xl px-5 sm:px-6"
          >
            <ul className="grid gap-4 rounded-3xl border border-lavender-deep/40 bg-cream-dark/60 p-5 shadow-sm sm:grid-cols-3 sm:p-6">
              {[
                { label: "Private & secure", detail: "Your journal and data stay yours" },
                { label: "Community-led", detail: "Real groups, real connection" },
                { label: "AI with care", detail: "Guidance, never judgment" },
              ].map((item) => (
                <li
                  key={item.label}
                  className="rounded-2xl bg-lavender-light/80 px-4 py-4 text-center sm:text-left"
                >
                  <p className="font-semibold text-ink">{item.label}</p>
                  <p className="mt-1 text-sm text-ink-muted">{item.detail}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* CTA band */}
          <section
            aria-labelledby="cta-heading"
            className="mx-auto max-w-6xl px-5 pb-20 sm:px-6"
          >
            <div className="rounded-3xl bg-gradient-to-br from-purple via-purple-soft to-lavender-deep px-6 py-12 text-center shadow-xl shadow-purple/20 sm:px-12 sm:py-14">
              <h2
                id="cta-heading"
                className="text-2xl font-semibold text-cream sm:text-3xl"
              >
                Ready to find your haven?
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-cream/90">
                Join families building a safer, stronger future — together.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button
                  href="/dashboard"
                  variant="secondary"
                  className="w-full border-cream/40 bg-cream text-purple-deep hover:bg-cream-dark sm:w-auto"
                >
                  Get Started
                </Button>
                <Button
                  href="/dashboard"
                  variant="ghost"
                  className="w-full text-cream hover:bg-cream/15 sm:w-auto"
                >
                  Explore Resources
                </Button>
              </div>
            </div>
          </section>
        </main>

        <LandingFooter />
      </div>
    </>
  );
}

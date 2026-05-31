import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/Button";

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-lavender-light via-cream to-cream"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-lavender/60 blur-3xl"
        aria-hidden
      />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-10 flex flex-col items-center">
          <BrandLogo href="/" size="lg" />
        </div>

        <p className="max-w-xl text-lg leading-relaxed text-ink-muted sm:text-xl">
          A Safe Place. A Stronger Future. Together.
        </p>

        <p className="mt-6 max-w-lg text-sm leading-relaxed text-ink-muted/90 sm:text-base">
          Nazaya Haven connects families with community, support groups, local
          resources, and caring AI guidance — all in one gentle space.
        </p>

        <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:gap-5">
          <Button href="/login" variant="primary">
            Create Account
          </Button>
          <Button href="/dashboard" variant="secondary">
            Explore the Hub
          </Button>
        </div>

        <p className="mt-14 text-xs text-ink-muted">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-semibold text-purple underline-offset-2 hover:text-purple-deep hover:underline"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}

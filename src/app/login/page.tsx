import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/Button";
import { PageShell } from "@/components/PageShell";

export default function LoginPage() {
  return (
    <PageShell maxWidth="md">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <BrandLogo href="/" size="sm" />
        </div>

        <div className="rounded-3xl border border-lavender-deep/50 bg-cream-dark/90 p-8 shadow-lg shadow-purple/5 backdrop-blur-sm">
          <h1 className="text-center text-2xl font-semibold text-ink">
            Demo access
          </h1>
          <p className="mt-2 text-center text-sm text-ink-muted">
            Enter the static preview with a preloaded caregiver profile.
          </p>

          <form
            className="mt-8"
            action="/dashboard"
            method="get"
          >
            <p className="mb-5 rounded-2xl bg-lavender-light px-4 py-3 text-sm leading-relaxed text-ink-muted">
              Real authentication belongs in the hosted runtime. This preview
              shows what an authenticated caregiver state looks like while the
              team evaluates sponsor-backed auth options.
            </p>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
            >
              Enter demo
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center">
          <Link href="/" className="text-sm text-ink-muted hover:text-purple">
            ← Back to home
          </Link>
        </p>
      </div>
    </PageShell>
  );
}

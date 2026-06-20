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
          <h1 className="text-center text-2xl font-semibold text-ink">Welcome back</h1>
          <p className="mt-2 text-center text-sm text-ink-muted">
            Sign in to continue to your haven
          </p>

          <form
            className="mt-8 space-y-5"
            action="/dashboard"
            method="get"
          >
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-ink"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                className="w-full rounded-xl border border-lavender-deep/60 bg-cream px-4 py-3 text-ink placeholder:text-ink-muted/50 focus:border-purple focus:outline-none focus:ring-2 focus:ring-purple/20"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-ink"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="••••••••"
                className="w-full rounded-xl border border-lavender-deep/60 bg-cream px-4 py-3 text-ink placeholder:text-ink-muted/50 focus:border-purple focus:outline-none focus:ring-2 focus:ring-purple/20"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
            >
              Sign In
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-muted">
            New here?{" "}
            <Link
              href="/login"
              className="font-semibold text-purple hover:text-purple-deep"
            >
              Create an account
            </Link>
          </p>
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

"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <main className="flex min-h-screen items-center justify-center bg-cream px-6 py-12">
          <section className="max-w-lg rounded-2xl border border-lavender-deep/40 bg-white p-6 text-center shadow-sm">
            <p className="text-sm font-medium uppercase tracking-wider text-purple-soft">
              Nazaya Haven
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-ink">
              Something went wrong
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              We could not load this view. The issue has been marked for review
              when hosted observability is configured.
            </p>
            {error.digest ? (
              <p className="mt-3 text-xs text-ink-muted">
                Error reference: {error.digest}
              </p>
            ) : null}
            <button
              type="button"
              onClick={reset}
              className="mt-5 rounded-full bg-purple px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-deep"
            >
              Try again
            </button>
          </section>
        </main>
      </body>
    </html>
  );
}

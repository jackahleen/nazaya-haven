import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="border-t border-lavender-deep/30 bg-lavender-light/40">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-12">
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="text-lg font-semibold text-ink">Nazaya Haven</p>
            <p className="mt-1 max-w-sm text-sm text-ink-muted">
              A welcoming space built for families — safe, supportive, and
              always on your side.
            </p>
          </div>
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap justify-center gap-4 text-sm font-medium text-ink-muted sm:justify-end">
              <li>
                <Link
                  href="/login"
                  className="rounded-md hover:text-purple focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple"
                >
                  Get Started
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="rounded-md hover:text-purple focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple"
                >
                  Explore Resources
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="rounded-md hover:text-purple focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple"
                >
                  Sign In
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <p className="mt-8 text-center text-xs text-ink-muted sm:text-left">
          © {new Date().getFullYear()} Nazaya Haven. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

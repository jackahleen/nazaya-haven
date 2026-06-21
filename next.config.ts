import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const rawBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const normalizedBasePath =
  rawBasePath === "/" ? "" : rawBasePath.replace(/\/$/, "");

const githubPagesPath =
  normalizedBasePath.length > 0
    ? {
        assetPrefix: normalizedBasePath,
        basePath: normalizedBasePath,
      }
    : {};

// GitHub Pages needs a fully static export; Vercel and local dev run the
// dynamic API routes. Vercel sets VERCEL=1 automatically; NAZAYA_RUNTIME=hosted
// forces the same behavior for local production-build testing.
const isHostedRuntime =
  process.env.NODE_ENV === "development" ||
  Boolean(process.env.VERCEL) ||
  process.env.NAZAYA_RUNTIME === "hosted";

const nextConfig: NextConfig = {
  ...(isHostedRuntime ? {} : { output: "export" as const }),
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_NAZAYA_RUNTIME: isHostedRuntime ? "hosted" : "static",
  },
  ...githubPagesPath,
};

const sentrySourceMapsEnabled = Boolean(
  process.env.SENTRY_AUTH_TOKEN &&
    process.env.SENTRY_ORG &&
    process.env.SENTRY_PROJECT,
);

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
  telemetry: false,
  widenClientFileUpload: true,
  sourcemaps: {
    disable: !sentrySourceMapsEnabled,
  },
});

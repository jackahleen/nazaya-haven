import type { NextConfig } from "next";

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

export default nextConfig;

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

// GitHub Pages needs a fully static export; Vercel runs the dynamic API routes
// (and holds the server secrets), so static export is disabled there. Vercel
// sets VERCEL=1 automatically; NAZAYA_RUNTIME=hosted forces the same locally.
const isHostedRuntime =
  Boolean(process.env.VERCEL) || process.env.NAZAYA_RUNTIME === "hosted";

const nextConfig: NextConfig = {
  ...(isHostedRuntime ? {} : { output: "export" as const }),
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  ...githubPagesPath,
};

export default nextConfig;

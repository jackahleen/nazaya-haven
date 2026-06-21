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

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  ...githubPagesPath,
};

export default nextConfig;

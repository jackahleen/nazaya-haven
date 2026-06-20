import type { MetadataRoute } from "next";

const rawBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const basePath = rawBasePath === "/" ? "" : rawBasePath.replace(/\/$/, "");

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nazaya Haven",
    short_name: "Nazaya",
    description:
      "A foster-family support hub for resources, social services, community, and guided assistance.",
    start_url: `${basePath}/`,
    scope: `${basePath}/`,
    display: "standalone",
    background_color: "#faf7f2",
    theme_color: "#7c5cbf",
    icons: [
      {
        src: `${basePath}/icons/nazaya-icon.svg`,
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}

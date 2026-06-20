import type { Metadata, Viewport } from "next";
import "./globals.css";

const rawBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const basePath = rawBasePath === "/" ? "" : rawBasePath.replace(/\/$/, "");
const withBasePath = (path: `/${string}`) => `${basePath}${path}`;

export const metadata: Metadata = {
  title: {
    default: "Nazaya Haven",
    template: "%s | Nazaya Haven",
  },
  description:
    "A foster-family support hub for resources, social services, community, and guided assistance.",
  applicationName: "Nazaya Haven",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Nazaya Haven",
  },
  icons: {
    icon: withBasePath("/icons/nazaya-icon.svg"),
    apple: withBasePath("/icons/nazaya-icon.svg"),
  },
  manifest: withBasePath("/manifest.webmanifest"),
};

export const viewport: Viewport = {
  themeColor: "#7c5cbf",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}

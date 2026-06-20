import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nazaya Haven",
  description:
    "A safe place for families and children — advocacy, support, and community.",
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

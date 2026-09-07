import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FIGR NXT — Student-First Career Explorer",
  description:
    "A broad, evidence-based career exploration prototype with adaptive assessments, learning trials and human counsellor handoff.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  other: {
    "codex-preview": "development",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}

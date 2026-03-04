import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.thesubhstack.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "thesubhstack — Engineering Blog",
    template: "%s · thesubhstack",
  },
  description:
    "Engineering blog by Subhranshu — full-stack web development, system design, AI/ML, and deep-dives into the tools I build with.",
  keywords: [
    "engineering blog",
    "full-stack",
    "typescript",
    "nextjs",
    "python",
    "system design",
    "software engineering",
  ],
  authors: [{ name: "Subhranshu", url: SITE_URL }],
  creator: "Subhranshu",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "subhstack",
    title: "subhstack — Engineering Blog",
    description:
      "Engineering blog by Subhranshu — full-stack web development, system design, and AI.",
  },
  twitter: {
    card: "summary_large_image",
    site: "@subhstack",
    creator: "@subhstack",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* KaTeX CSS for math rendering */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-dvh flex flex-col`}
        style={{ backgroundColor: "var(--bg-base)", color: "var(--text-primary)" }}
      >
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

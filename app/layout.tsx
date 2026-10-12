import type { Metadata } from "next";
import { Figtree, Oxanium } from "next/font/google";
import type { ReactNode } from "react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SiteServices } from "@/components/site-services";
import { guideArticles } from "@/lib/articles";

import { site } from "@/lib/site-data";

import "./globals.css";

const figtree = Figtree({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const oxanium = Oxanium({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: "%s | WoG Wiki" },
  description: site.description,
  keywords: ["War of Genesis", "Idle Loot", "Steam", "wiki", "classes", "market", "G-Coins", "Profile"],
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" }, { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
  openGraph: { title: site.title, description: site.description, type: "website", locale: "en_US" },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={`${figtree.variable} ${oxanium.variable}`}>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteServices advertisingPaths={["/", "/guides", ...guideArticles.map(({ metadata }) => `/guides/${metadata.slug}`)]} />
        <SiteFooter />
      </body>
    </html>
  );
}

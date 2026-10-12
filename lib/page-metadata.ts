import type { Metadata } from "next";

import { site } from "@/lib/site-data";

interface PageMetadataInput {
  title: string;
  description: string;
  path: string;
}

export function createPageMetadata({ title, description, path }: PageMetadataInput): Metadata {
  const url = new URL(path, site.url).toString();

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      locale: "en_US",
      siteName: site.name,
      images: [{
        url: new URL("/android-chrome-512x512.png", site.url).toString(),
        width: 512,
        height: 512,
        alt: "Independent War of Genesis guide-site icon",
      }],
    },
  };
}

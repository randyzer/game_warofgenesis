"use client";

import { useEffect } from "react";

import { site } from "@/lib/site-data";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function SiteServices() {
  useEffect(() => {
    // Keep audits and previews out of the production analytics stream.
    if (window.location.origin !== site.url || document.getElementById("wog-google-tag")) return;

    window.dataLayer = window.dataLayer ?? [];
    window.gtag = window.gtag ?? function gtag() {
      // eslint-disable-next-line prefer-rest-params -- gtag commands require an Arguments object.
      window.dataLayer?.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", site.measurement.ga4Id);

    const script = document.createElement("script");
    script.id = "wog-google-tag";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${site.measurement.ga4Id}`;
    document.head.appendChild(script);
  }, []);

  return null;
}

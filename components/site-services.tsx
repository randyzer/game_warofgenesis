"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { site } from "@/lib/site-data";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

interface SiteServicesProps {
  advertisingPaths: readonly string[];
}

export function SiteServices({ advertisingPaths }: SiteServicesProps) {
  const pathname = usePathname();
  const showAdvertisement = advertisingPaths.includes(pathname);
  const adContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Keep audits and previews out of the production analytics stream.
    if (window.location.origin !== site.url || document.getElementById("wog-google-tag")) return;

    window.dataLayer = window.dataLayer ?? [];
    window.gtag = window.gtag ?? ((...args: unknown[]) => { window.dataLayer?.push(args); });
    window.gtag("js", new Date());
    window.gtag("config", site.measurement.ga4Id);

    const script = document.createElement("script");
    script.id = "wog-google-tag";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${site.measurement.ga4Id}`;
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    const container = adContainer.current;
    if (!showAdvertisement || !container || window.location.origin !== site.url) return;

    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src = site.measurement.adsterraScript;
    container.before(script);

    return () => {
      script.remove();
      container.replaceChildren();
    };
  }, [showAdvertisement]);

  if (!showAdvertisement) return null;

  return <aside className="advertisement page-shell" aria-label="Advertisement">
    <p className="section-eyebrow">Advertisement</p>
    <div id={site.measurement.adsterraContainer} ref={adContainer} />
  </aside>;
}

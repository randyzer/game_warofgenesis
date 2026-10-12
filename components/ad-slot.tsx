"use client";

import type { Locale } from "@/lib/i18n/locales";

import { useEffect, useRef } from "react";

import { site } from "@/lib/site-data";

interface AdSlotProps {
  locale?: Locale;
  className?: string;
}

// Preserve the vendor's container and pending script when the page changes.
let bannerWidget: HTMLDivElement | undefined;

export function AdSlot({ className, locale = "en" }: AdSlotProps) {
  const adHost = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = adHost.current;
    if (!host || window.location.origin !== site.url) return;

    if (!bannerWidget) {
      const container = document.createElement("div");
      container.id = site.measurement.adsterraContainer;

      const script = document.createElement("script");
      script.async = true;
      script.setAttribute("data-cfasync", "false");
      script.src = site.measurement.adsterraScript;

      bannerWidget = document.createElement("div");
      bannerWidget.append(script, container);
    }

    const widget = bannerWidget;
    host.appendChild(widget);

    return () => {
      if (widget.parentNode === host) widget.remove();
    };
  }, []);

  const label = {en:"Advertisement",ko:"광고",ja:"広告","pt-br":"Publicidade","zh-hant":"廣告"}[locale];
  return (
    <aside className={["advertisement", className].filter(Boolean).join(" ")} aria-label={label}>
      <p className="section-eyebrow">{label}</p>
      <div data-ad-slot-host ref={adHost} />
    </aside>
  );
}

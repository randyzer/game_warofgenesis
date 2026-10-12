"use client";

import { useEffect, useRef } from "react";

import { site } from "@/lib/site-data";

interface AdSlotProps {
  className?: string;
}

// Preserve the vendor's container and pending script when the page changes.
let bannerWidget: HTMLDivElement | undefined;

export function AdSlot({ className }: AdSlotProps) {
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

  return (
    <aside className={["advertisement", className].filter(Boolean).join(" ")} aria-label="Advertisement">
      <p className="section-eyebrow">Advertisement</p>
      <div data-ad-slot-host ref={adHost} />
    </aside>
  );
}

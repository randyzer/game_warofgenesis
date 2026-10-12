"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

export interface MobileMenuLink {
  href: string;
  label: string;
}

interface MobileMenuProps {
  guideLinks: readonly MobileMenuLink[];
  exploreLinks: readonly MobileMenuLink[];
}

type AccordionName = "guides" | "explore";

export function MobileMenu({ guideLinks, exploreLinks }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<AccordionName | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const instanceId = useId();
  const menuId = `${instanceId}-navigation`;
  const guidesId = `${instanceId}-guides`;
  const exploreId = `${instanceId}-explore`;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        setOpenAccordion(null);
        menuButtonRef.current?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  function closeMenu() {
    setIsOpen(false);
    setOpenAccordion(null);
  }

  function toggleAccordion(name: AccordionName) {
    setOpenAccordion((current) => (current === name ? null : name));
  }

  const guidesOpen = openAccordion === "guides";
  const exploreOpen = openAccordion === "explore";

  return (
    <div className="mobile-nav">
      <button
        aria-controls={menuId}
        aria-expanded={isOpen}
        className="mobile-menu-button"
        data-open={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        ref={menuButtonRef}
        type="button"
      >
        <span className="sr-only">{isOpen ? "Close menu" : "Open menu"}</span>
        <span aria-hidden="true" className="menu-icon">
          <span className="menu-icon__line" />
          <span className="menu-icon__line" />
          <span className="menu-icon__line" />
        </span>
      </button>

      <nav
        aria-label="Mobile navigation"
        className="mobile-menu"
        data-open={isOpen}
        id={menuId}
      >
        <div className="mobile-menu__inner page-shell">
          <Link href="/" onClick={closeMenu}>
            Home
          </Link>

          <div className="mobile-menu__section">
            <button
              aria-controls={guidesId}
              aria-expanded={guidesOpen}
              className="mobile-menu__section-button"
              onClick={() => toggleAccordion("guides")}
              type="button"
            >
              Guides
            </button>
            <div
              className="mobile-submenu"
              hidden={!guidesOpen}
              id={guidesId}
            >
              {guideLinks.map((link) => (
                <Link href={link.href} key={link.href} onClick={closeMenu}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="mobile-menu__section">
            <button
              aria-controls={exploreId}
              aria-expanded={exploreOpen}
              className="mobile-menu__section-button"
              onClick={() => toggleAccordion("explore")}
              type="button"
            >
              Explore
            </button>
            <div
              className="mobile-submenu"
              hidden={!exploreOpen}
              id={exploreId}
            >
              {exploreLinks.map((link) => (
                <Link href={link.href} key={link.href} onClick={closeMenu}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <Link
            className="button-link button--primary mobile-menu__cta"
            href="/guides/getting-started/"
            onClick={closeMenu}
          >
            Start reading
          </Link>
        </div>
      </nav>
    </div>
  );
}

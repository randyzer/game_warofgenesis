import { localize } from "@/lib/i18n/translate";
import type { Locale } from "@/lib/i18n/locales";
import Link from "next/link";
import type { ReactNode } from "react";

interface ButtonLinkProps {
  locale?: Locale;
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className,
  locale = "en",
}: ButtonLinkProps) {
  const classes = ["button-link", `button--${variant}`, className]
    .filter(Boolean)
    .join(" ");

  return localize(
    <Link className={classes} href={href}>
      {children}
    </Link>
  , locale);
}

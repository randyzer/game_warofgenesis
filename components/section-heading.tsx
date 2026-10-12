import { localize } from "@/lib/i18n/translate";
import type { Locale } from "@/lib/i18n/locales";
interface SectionHeadingProps {
  locale?: Locale;
  eyebrow: string;
  title: string;
  description?: string;
  id?: string;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  id,
  className,
  locale = "en",
}: SectionHeadingProps) {
  const classes = ["section-heading", className].filter(Boolean).join(" ");

  return localize(
    <header className={classes}>
      <p className="section-eyebrow">{eyebrow}</p>
      <h2 id={id}>{title}</h2>
      {description ? (
        <p className="section-description">{description}</p>
      ) : null}
    </header>
  , locale);
}

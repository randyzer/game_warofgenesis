interface SectionHeadingProps {
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
}: SectionHeadingProps) {
  const classes = ["section-heading", className].filter(Boolean).join(" ");

  return (
    <header className={classes}>
      <p className="section-eyebrow">{eyebrow}</p>
      <h2 id={id}>{title}</h2>
      {description ? (
        <p className="section-description">{description}</p>
      ) : null}
    </header>
  );
}

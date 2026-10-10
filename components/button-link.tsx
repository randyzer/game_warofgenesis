import Link from "next/link";
import type { ReactNode } from "react";

interface ButtonLinkProps {
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
}: ButtonLinkProps) {
  const classes = ["button-link", `button--${variant}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <Link className={classes} href={href}>
      {children}
    </Link>
  );
}

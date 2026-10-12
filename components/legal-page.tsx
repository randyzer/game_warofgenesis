import { localize, text } from "@/lib/i18n/translate";
import type { Locale } from "@/lib/i18n/locales";
import Link from "next/link";
import type { ReactNode } from "react";

import { legalPages } from "@/lib/legal-pages";

interface LegalPageProps {
  locale?: Locale;
  title: string;
  children: ReactNode;
}

export function LegalPage({ title, children, locale = "en" }: LegalPageProps) {
  return localize(
    <article className="legal-document page-shell">
      <header className="article-header">
        <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-current="page">{title}</span></nav>
        <p className="article-category">Site information</p>
        <h1 className="article-title">{title}</h1>
        <p className="article-meta">Last updated <time dateTime="2026-10-12">October 12, 2026</time></p>
      </header>
      <div className="prose-wiki">{children}</div>
      <nav className="legal-links" aria-label="Site policies">
        {legalPages.map((page) => <Link key={page.path} href={page.path} aria-current={text(page.title, locale) === title ? "page" : undefined}>{page.title}</Link>)}
      </nav>
    </article>
  , locale);
}

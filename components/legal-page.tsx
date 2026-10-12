import Link from "next/link";
import type { ReactNode } from "react";

import { legalPages } from "@/lib/legal-pages";

interface LegalPageProps {
  title: string;
  children: ReactNode;
}

export function LegalPage({ title, children }: LegalPageProps) {
  return (
    <article className="legal-document page-shell">
      <header className="article-header">
        <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-current="page">{title}</span></nav>
        <p className="article-category">Site information</p>
        <h1 className="article-title">{title}</h1>
        <p className="article-meta">Last updated <time dateTime="2026-10-12">October 12, 2026</time></p>
      </header>
      <div className="prose-wiki">{children}</div>
      <nav className="legal-links" aria-label="Site policies">
        {legalPages.map((page) => <a key={page.path} href={page.path} aria-current={page.title === title ? "page" : undefined}>{page.title}</a>)}
      </nav>
    </article>
  );
}

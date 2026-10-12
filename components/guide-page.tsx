import { ArticleShell } from "@/components/article-shell";
import { getArticles } from "@/lib/i18n/articles";
import { getRelatedGuides } from "@/lib/articles";
import { localePath, type Locale } from "@/lib/i18n/locales";
import type { ComponentPropsWithRef } from "react";
import Link from "next/link";
export function GuideContent({ slug, locale }: { slug:string; locale:Locale }) {
 const all = getArticles(locale);
 const article = slug === "overview" ? all.guideOverview : all.guideArticles.find(a=>a.metadata.slug === slug);
 if (!article) throw new Error("Unknown guide: " + slug);
 const related = getRelatedGuides(slug).map(a => all.guideArticles.find(b=>b.metadata.slug === a.metadata.slug)).filter(a=>a !== undefined);
 const {Content,metadata} = article;
 function MdxLink({href,...props}:ComponentPropsWithRef<"a">) { return href?.startsWith("/") && !href.startsWith("//") ? <Link href={localePath(href,locale)} {...props}/> : <a href={href} {...props}/>; }
 return <ArticleShell metadata={metadata} related={related} locale={locale}><Content components={{a:MdxLink}}/></ArticleShell>;
}

import type { ArticleRecord } from "@/lib/articles";
import { guideOverview, guideArticles, parseArticleMetadata } from "@/lib/articles";
import type { Locale } from "./locales";
import ko0, { metadata as ko0Metadata } from "@/content/locales/ko/guides/classes.mdx";
import ko1, { metadata as ko1Metadata } from "@/content/locales/ko/guides/discord.mdx";
import ko2, { metadata as ko2Metadata } from "@/content/locales/ko/guides/getting-started.mdx";
import ko3, { metadata as ko3Metadata } from "@/content/locales/ko/guides/in-app-purchases.mdx";
import ko4, { metadata as ko4Metadata } from "@/content/locales/ko/guides/market-buying.mdx";
import ko5, { metadata as ko5Metadata } from "@/content/locales/ko/guides/market.mdx";
import ko6, { metadata as ko6Metadata } from "@/content/locales/ko/guides/overview.mdx";
import ko7, { metadata as ko7Metadata } from "@/content/locales/ko/guides/player-count.mdx";
import ko8, { metadata as ko8Metadata } from "@/content/locales/ko/guides/profile.mdx";
import ko9, { metadata as ko9Metadata } from "@/content/locales/ko/guides/vs-path-of-idle.mdx";
import ja0, { metadata as ja0Metadata } from "@/content/locales/ja/guides/classes.mdx";
import ja1, { metadata as ja1Metadata } from "@/content/locales/ja/guides/discord.mdx";
import ja2, { metadata as ja2Metadata } from "@/content/locales/ja/guides/getting-started.mdx";
import ja3, { metadata as ja3Metadata } from "@/content/locales/ja/guides/in-app-purchases.mdx";
import ja4, { metadata as ja4Metadata } from "@/content/locales/ja/guides/market-buying.mdx";
import ja5, { metadata as ja5Metadata } from "@/content/locales/ja/guides/market.mdx";
import ja6, { metadata as ja6Metadata } from "@/content/locales/ja/guides/overview.mdx";
import ja7, { metadata as ja7Metadata } from "@/content/locales/ja/guides/player-count.mdx";
import ja8, { metadata as ja8Metadata } from "@/content/locales/ja/guides/profile.mdx";
import ja9, { metadata as ja9Metadata } from "@/content/locales/ja/guides/vs-path-of-idle.mdx";
import ptbr0, { metadata as ptbr0Metadata } from "@/content/locales/pt-br/guides/classes.mdx";
import ptbr1, { metadata as ptbr1Metadata } from "@/content/locales/pt-br/guides/discord.mdx";
import ptbr2, { metadata as ptbr2Metadata } from "@/content/locales/pt-br/guides/getting-started.mdx";
import ptbr3, { metadata as ptbr3Metadata } from "@/content/locales/pt-br/guides/in-app-purchases.mdx";
import ptbr4, { metadata as ptbr4Metadata } from "@/content/locales/pt-br/guides/market-buying.mdx";
import ptbr5, { metadata as ptbr5Metadata } from "@/content/locales/pt-br/guides/market.mdx";
import ptbr6, { metadata as ptbr6Metadata } from "@/content/locales/pt-br/guides/overview.mdx";
import ptbr7, { metadata as ptbr7Metadata } from "@/content/locales/pt-br/guides/player-count.mdx";
import ptbr8, { metadata as ptbr8Metadata } from "@/content/locales/pt-br/guides/profile.mdx";
import ptbr9, { metadata as ptbr9Metadata } from "@/content/locales/pt-br/guides/vs-path-of-idle.mdx";
import zhhant0, { metadata as zhhant0Metadata } from "@/content/locales/zh-hant/guides/classes.mdx";
import zhhant1, { metadata as zhhant1Metadata } from "@/content/locales/zh-hant/guides/discord.mdx";
import zhhant2, { metadata as zhhant2Metadata } from "@/content/locales/zh-hant/guides/getting-started.mdx";
import zhhant3, { metadata as zhhant3Metadata } from "@/content/locales/zh-hant/guides/in-app-purchases.mdx";
import zhhant4, { metadata as zhhant4Metadata } from "@/content/locales/zh-hant/guides/market-buying.mdx";
import zhhant5, { metadata as zhhant5Metadata } from "@/content/locales/zh-hant/guides/market.mdx";
import zhhant6, { metadata as zhhant6Metadata } from "@/content/locales/zh-hant/guides/overview.mdx";
import zhhant7, { metadata as zhhant7Metadata } from "@/content/locales/zh-hant/guides/player-count.mdx";
import zhhant8, { metadata as zhhant8Metadata } from "@/content/locales/zh-hant/guides/profile.mdx";
import zhhant9, { metadata as zhhant9Metadata } from "@/content/locales/zh-hant/guides/vs-path-of-idle.mdx";
function verifiedRecord(value: unknown, Content: ArticleRecord["Content"]): ArticleRecord {
 const metadata = parseArticleMetadata(value, "localized article");
 const original = metadata.slug === "overview" ? guideOverview : guideArticles.find(a => a.metadata.slug === metadata.slug);
 if (!original || metadata.publishedAt !== original.metadata.publishedAt || metadata.lastVerified !== original.metadata.lastVerified || metadata.cover !== original.metadata.cover || metadata.sections.map(s => s.id).join("|") !== original.metadata.sections.map(s => s.id).join("|") || metadata.faqs.length !== original.metadata.faqs.length) throw new Error("Localized article structure mismatch: " + metadata.slug);
 for (const field of [metadata.title,metadata.description,metadata.category,metadata.coverAlt,...metadata.sections.map(s=>s.label),...metadata.faqs.flatMap(f=>[f.question,f.answer])]) if (!field.trim()) throw new Error("Empty localized article field: " + metadata.slug);
 return { metadata, Content };
}
const translations: Record<Exclude<Locale,"en">, readonly ArticleRecord[]> = {
 "ko": [verifiedRecord(ko0Metadata,ko0),verifiedRecord(ko1Metadata,ko1),verifiedRecord(ko2Metadata,ko2),verifiedRecord(ko3Metadata,ko3),verifiedRecord(ko4Metadata,ko4),verifiedRecord(ko5Metadata,ko5),verifiedRecord(ko6Metadata,ko6),verifiedRecord(ko7Metadata,ko7),verifiedRecord(ko8Metadata,ko8),verifiedRecord(ko9Metadata,ko9)],
 "ja": [verifiedRecord(ja0Metadata,ja0),verifiedRecord(ja1Metadata,ja1),verifiedRecord(ja2Metadata,ja2),verifiedRecord(ja3Metadata,ja3),verifiedRecord(ja4Metadata,ja4),verifiedRecord(ja5Metadata,ja5),verifiedRecord(ja6Metadata,ja6),verifiedRecord(ja7Metadata,ja7),verifiedRecord(ja8Metadata,ja8),verifiedRecord(ja9Metadata,ja9)],
 "pt-br": [verifiedRecord(ptbr0Metadata,ptbr0),verifiedRecord(ptbr1Metadata,ptbr1),verifiedRecord(ptbr2Metadata,ptbr2),verifiedRecord(ptbr3Metadata,ptbr3),verifiedRecord(ptbr4Metadata,ptbr4),verifiedRecord(ptbr5Metadata,ptbr5),verifiedRecord(ptbr6Metadata,ptbr6),verifiedRecord(ptbr7Metadata,ptbr7),verifiedRecord(ptbr8Metadata,ptbr8),verifiedRecord(ptbr9Metadata,ptbr9)],
 "zh-hant": [verifiedRecord(zhhant0Metadata,zhhant0),verifiedRecord(zhhant1Metadata,zhhant1),verifiedRecord(zhhant2Metadata,zhhant2),verifiedRecord(zhhant3Metadata,zhhant3),verifiedRecord(zhhant4Metadata,zhhant4),verifiedRecord(zhhant5Metadata,zhhant5),verifiedRecord(zhhant6Metadata,zhhant6),verifiedRecord(zhhant7Metadata,zhhant7),verifiedRecord(zhhant8Metadata,zhhant8),verifiedRecord(zhhant9Metadata,zhhant9)],
};
export function getArticles(locale: Locale) {
 if (locale === "en") return { guideOverview, guideArticles };
 const all = translations[locale];
 const overview = all.find(a => a.metadata.slug === "overview");
 if (!overview) throw new Error("Missing translated overview: " + locale);
 const guides = guideArticles.map(original => {
  const translated = all.find(a => a.metadata.slug === original.metadata.slug);
  if (!translated) throw new Error("Missing translated guide: " + locale + "/" + original.metadata.slug);
  return translated;
 });
 return { guideOverview:overview, guideArticles:guides };
}

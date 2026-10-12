import {locales, localePath, languageInfo} from "@/lib/i18n/locales";
import type { MetadataRoute } from "next";

import { guideArticles } from "@/lib/articles";
import { site } from "@/lib/site-data";
import { legalPages } from "@/lib/legal-pages";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/guides", ...guideArticles.map(({ metadata }) => `/guides/${metadata.slug}`), ...legalPages.map(({ path }) => path)]
    .flatMap((path) => locales.map(locale => ({ url: new URL(localePath(path,locale), site.url).toString(), alternates:{languages:Object.fromEntries([...locales.map(value=>[languageInfo[value].language,new URL(localePath(path,value),site.url).toString()]),["x-default",new URL(path,site.url).toString()]])} })));
}

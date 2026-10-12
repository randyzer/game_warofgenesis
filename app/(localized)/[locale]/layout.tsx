import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { SiteLayout, rootMetadata } from "@/components/site-layout";
import { isLocale, translatedLocales } from "@/lib/i18n/locales";
export const metadata = rootMetadata;
export const dynamicParams = false;
export function generateStaticParams() {return translatedLocales.map(locale=>({locale}));}
export default async function Layout({children,params}: {children:ReactNode;params:Promise<{locale:string}>}) {
 const {locale} = await params;
 if (!isLocale(locale) || locale === "en") notFound();
 return <SiteLayout locale={locale}>{children}</SiteLayout>;
}

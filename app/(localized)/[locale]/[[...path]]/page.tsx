import type { Metadata } from "next";
import {notFound} from "next/navigation";
import {HomePage} from "@/components/home-page";
import {GuideContent} from "@/components/guide-page";
import {PrivacyPage} from "@/components/privacy-content";
import {CookiesPage} from "@/components/cookies-content";
import {TermsPage} from "@/components/terms-content";
import {getArticles} from "@/lib/i18n/articles";
import {isLocale, type Locale} from "@/lib/i18n/locales";
import {text} from "@/lib/i18n/translate";
import {createPageMetadata} from "@/lib/page-metadata";
import {site} from "@/lib/site-data";
import {legalPages} from "@/lib/legal-pages";
import {guideArticles} from "@/lib/articles";
type Params = {locale:string;path?:string[]};
export const dynamicParams = false;
export function generateStaticParams(){ return [[],["guides"],...guideArticles.map(a=>["guides",a.metadata.slug]),...legalPages.map(p=>[p.path.slice(1)])].map(path=>({path})); }
function pageInfo(params:Params): {locale:Locale;path:string;title:string;description:string} {
 const {locale} = params;if (!isLocale(locale) || locale === "en") notFound();
 const path = "/" + (params.path || []).join("/");
 if (path === "/") return {locale,path,title:text(site.title,locale),description:text(site.description,locale)};
 const policy=legalPages.find(p=>p.path === path);if(policy)return {locale,path,title:text(policy.title,locale),description:text(policy.description,locale)};
 const all=getArticles(locale);const a = path === "/guides" ? all.guideOverview : all.guideArticles.find(a=>path === "/guides/"+a.metadata.slug);
 if(!a)notFound();return {locale,path,title:a.metadata.title,description:a.metadata.description};
}
export async function generateMetadata({params}:{params:Promise<Params>}):Promise<Metadata>{const info=pageInfo(await params);return createPageMetadata(info);}
export default async function Page({params}:{params:Promise<Params>}){
 const {locale,path}=pageInfo(await params);
 if(path === "/")return <HomePage locale={locale}/>;
 if(path === "/privacy")return <PrivacyPage locale={locale}/>;
 if(path === "/cookies")return <CookiesPage locale={locale}/>;
 if(path === "/terms")return <TermsPage locale={locale}/>;
 return <GuideContent locale={locale} slug={path === "/guides" ? "overview" : path.split("/").at(-1)!}/>;
}

import { CookiesPage } from "@/components/cookies-content";
import { createPageMetadata } from "@/lib/page-metadata";
import { legalPages } from "@/lib/legal-pages";
export const metadata = createPageMetadata(legalPages[1]);
export default function Page(){return <CookiesPage />;}

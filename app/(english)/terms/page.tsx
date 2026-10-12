import { TermsPage } from "@/components/terms-content";
import { createPageMetadata } from "@/lib/page-metadata";
import { legalPages } from "@/lib/legal-pages";
export const metadata = createPageMetadata(legalPages[2]);
export default function Page(){return <TermsPage />;}

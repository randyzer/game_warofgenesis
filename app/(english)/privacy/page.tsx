import { PrivacyPage } from "@/components/privacy-content";
import { createPageMetadata } from "@/lib/page-metadata";
import { legalPages } from "@/lib/legal-pages";
export const metadata = createPageMetadata(legalPages[0]);
export default function Page(){return <PrivacyPage />;}

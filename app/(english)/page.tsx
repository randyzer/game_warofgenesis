import { HomePage } from "@/components/home-page";
import { createPageMetadata } from "@/lib/page-metadata";
import { site } from "@/lib/site-data";
export const metadata = createPageMetadata({path:"/", title:site.title, description:site.description});
export default function Page(){ return <HomePage />; }

import type { ReactNode } from "react";
import { SiteLayout, rootMetadata } from "@/components/site-layout";
export const metadata = rootMetadata;
export default function Layout({children}: {children:ReactNode}) {return <SiteLayout>{children}</SiteLayout>;}

import type { APIRoute } from "astro";

import { buildRobotsTxt } from "../core/seo";
import { siteConfig } from "../core/site-data";

export const prerender = true;

export const GET: APIRoute = () =>
  new Response(buildRobotsTxt(siteConfig), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });

import { site } from "@/lib/site-data";

export function retiredGuideResponse(): Response {
  return new Response(`This guide has been permanently removed. Published references: ${site.url}/guides\n`, {
    status: 410,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Robots-Tag": "noindex",
    },
  });
}

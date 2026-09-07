import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

import gameConfig from "./game.config";
import { getSitemapRoutes, buildCanonicalUrl } from "./src/core/seo";
import { enabledPageCatalog } from "./src/core/site-data";

const sitemapUrls = new Set(
  getSitemapRoutes(enabledPageCatalog).map((route) =>
    buildCanonicalUrl(gameConfig, route),
  ),
);

export default defineConfig({
  site: gameConfig.site.url,
  output: "static",
  trailingSlash: "always",
  integrations: [mdx(), react(), sitemap({ filter: (page) => sitemapUrls.has(page) })],
  vite: {
    plugins: [tailwindcss()],
  },
});

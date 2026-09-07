import { defineGameConfig } from "./src/config/schema";

export default defineGameConfig({
  brand: {
    name: "Game Atlas",
    shortName: "Atlas",
    mark: "GA",
    logoPath: "/logo.svg",
    tagline: "Clear answers for every session.",
  },
  site: {
    url: "https://gameatlas.example",
    locale: "en",
    timezone: "UTC",
  },
  seo: {
    defaultTitle: "Game Atlas — Guides, Builds & Game Data",
    titleTemplate: "%s | Game Atlas",
    defaultDescription:
      "A fast, source-aware starter for guides, builds, and game reference data.",
  },
  social: {
    xHandle: "@gameatlas",
  },
  navigation: {
    groups: [
      { label: "Home", pageId: "home" },
      {
        label: "Guides",
        pageId: "hub.guides",
        children: ["guide.getting-started"],
      },
      { label: "Search", pageId: "search" },
    ],
  },
  homepage: {
    featuredPageIds: ["guide.getting-started"],
  },
  features: {
    guides: true,
    heroes: false,
    weapons: false,
    items: false,
    maps: false,
    tierLists: false,
    news: false,
    search: true,
    calculator: false,
    planner: false,
  },
});

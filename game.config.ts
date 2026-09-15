import { defineGameConfig } from "./src/config/schema";

export default defineGameConfig({
  brand: {
    name: "War of Genesis Wiki",
    shortName: "WoG Wiki",
    mark: "WoG",
    logoPath: "/logo.svg",
    tagline: "Farm smarter. Build stronger. Trade with clarity.",
  },
  site: {
    url: "https://war-of-genesis.wiki",
    locale: "en",
    timezone: "UTC",
  },
  seo: {
    defaultTitle: "War of Genesis Wiki — Farming, Items & Builds",
    titleTemplate: "%s | War of Genesis Wiki",
    defaultDescription:
      "Decision support for [WoG] War of Genesis: Idle Loot farming, equipment, builds, and Steam Market progression.",
  },
  social: {},
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
    displayHeading: "[WoG] War of Genesis: Idle Loot",
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

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
      {
        label: "Guides",
        pageId: "hub.guides",
        children: ["guide.beginner-guide", "guide.farming", "guide.gear"],
      },
      {
        label: "Market",
        pageId: "hub.market",
        children: [
          "market.best-items-to-sell",
          "market.how-to-sell-items",
          "market.steam-market-fees",
        ],
      },
      { label: "Builds", pageId: "hub.builds" },
      {
        label: "Tools",
        pageId: "hub.tools",
        children: ["tool.steam-market-fee-calculator"],
      },
    ],
  },
  homepage: {
    displayHeading: "[WoG] War of Genesis: Idle Loot",
    featuredPageIds: [
      "guide.beginner-guide",
      "guide.farming",
      "guide.gear",
      "tool.steam-market-fee-calculator",
      "hub.builds",
      "hub.market",
    ],
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
    calculator: true,
    planner: false,
  },
});

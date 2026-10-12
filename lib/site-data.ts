export type SiteHref = "/" | "/guides/" | `/guides/${string}/` | `/#${string}`;
export interface SiteLink { readonly label: string; readonly href: SiteHref; }
export interface HomeStat { readonly value: string; readonly label: string; }
export interface CategoryCard {
  readonly key: string; readonly id: string; readonly title: string;
  readonly number: string; readonly description: string; readonly links: readonly SiteLink[];
}
export interface SiteUpdate { readonly category: string; readonly date: string; readonly title: string; readonly href: string; }
export interface PopularLink extends SiteLink { readonly number: string; }
export interface QuickStep { readonly number: string; readonly title: string; readonly description: string; }
export interface HomeFaq { readonly question: string; readonly answer: string; }

export const site = {
  url: "https://war-of-genesis.wiki",
  operator: { name: "randy", email: "StarBelkeKZU@gmail.com" },
  measurement: {
    ga4Id: "G-K0NGHRYPZ3",
    adsterraScript: "https://pl31468463.profitableratecpmnetwork.com/b8bc5ad535a79dcab713fda8ed0c75cf/invoke.js",
    adsterraContainer: "container-b8bc5ad535a79dcab713fda8ed0c75cf",
  },
  name: "War of Genesis: Idle Loot Wiki",
  shortName: "War of Genesis Wiki",
  title: "War of Genesis: Idle Loot Wiki — Classes & Market",
  description: "Explore War of Genesis: Idle Loot with verified Steam-game references for classes, profile settings, G-Coins, official communities, and market trading.",
  verifiedAt: "2026-10-10",
  links: {
    steam: "https://store.steampowered.com/app/4891320/WoG_War_of_Genesis_Idle_Loot/",
    news: "https://steamcommunity.com/app/4891320/allnews/",
    community: "https://steamcommunity.com/app/4891320",
    discord: "https://discord.gg/GyYsQ2xrPx",
    market: "https://steamcommunity.com/market/search?appid=4891320",
    support: "https://genesis-idleloot.zendesk.com/hc/en-us/requests/new",
    x: "https://x.com/GenesisIdleLoot",
  },
} as const;

export const stats = [
  { value: "Oct 7, 2026", label: "Full release" },
  { value: "3", label: "Named classes" },
  { value: "Windows", label: "Steam platform" },
  { value: "Free to Play", label: "Store listing · Oct 10" },
] as const satisfies readonly HomeStat[];

export const categoryCards = [
  { key: "guide", id: "guide-hub", title: "Guide", number: "01",
    description: "Identify the Steam game, understand automatic battles, and start with the documented equipment loop.",
    links: [{ label: "Getting started", href: "/guides/getting-started/" }, { label: "Game overview", href: "/guides/" }] },
  { key: "classes", id: "classes", title: "Classes and Builds", number: "02",
    description: "Meet Knight, Ranger, and Wizard. Separate the official names from conflicting Early Access rankings.",
    links: [{ label: "Classes reference", href: "/guides/classes/" }, { label: "Getting started", href: "/guides/getting-started/" }] },
  { key: "communities", id: "communities", title: "Communities", number: "03",
    description: "Find the officially cited Discord invitation and read a clearly dated Steam player-count snapshot.",
    links: [{ label: "Official Discord invite", href: "/guides/discord/" }, { label: "Player-count snapshot", href: "/guides/player-count/" }] },
  { key: "platforms", id: "platforms", title: "Platforms and Troubleshooting", number: "04",
    description: "Locate the documented User Code and Frame Shop, and understand the G-Coins purchase entry.",
    links: [{ label: "Profile and User Code", href: "/guides/profile/" }, { label: "In-app purchases", href: "/guides/in-app-purchases/" }] },
  { key: "market", id: "market", title: "Steam Market", number: "05",
    description: "Check the game-specific market, Inventory delivery, and the purchase restrictions recorded for one jewel.",
    links: [{ label: "Market basics", href: "/guides/market/" }, { label: "Buying and delivery", href: "/guides/market-buying/" }] },
] as const satisfies readonly CategoryCard[];

export const updates = [
  { category: "Official release", date: "2026-10-07", title: "Full release and G-Coins announcement", href: site.links.news },
  { category: "Official update", date: "2026-10-07", title: "Profile images and Frame Shop", href: site.links.news },
  { category: "Official update", date: "2026-09-17", title: "Market purchases move directly to Inventory", href: site.links.news },
] as const satisfies readonly SiteUpdate[];

// This is editorial order, not an analytics or popularity ranking.
export const popular = [
  { number: "01", label: "Getting started", href: "/guides/getting-started/" },
  { number: "02", label: "Knight, Ranger, and Wizard", href: "/guides/classes/" },
  { number: "03", label: "Profile and User Code", href: "/guides/profile/" },
  { number: "04", label: "Steam Market basics", href: "/guides/market/" },
  { number: "05", label: "Buying and item delivery", href: "/guides/market-buying/" },
  { number: "06", label: "Comparison with Path of Idle", href: "/guides/vs-path-of-idle/" },
] as const satisfies readonly PopularLink[];

export const quickSteps = [
  { number: "01", title: "Identify the Steam game", description: "This hub covers Steam App 4891320, War of Genesis: Idle Loot. Keep it separate from the older Idle Heroes mobile title and its codes." },
  { number: "02", title: "Learn the basic loop", description: "The verified desktop loop is automatic combat with the client running. Read the beginner reference for Blacksmith functions and dated Early Access advice." },
  { number: "03", title: "Understand the three class names", description: "Knight, Ranger, and Wizard are named in the official October update. The supplied evidence does not establish a universal current strength ranking." },
  { number: "04", title: "Read before a purchase", description: "Distinguish G-Coins in Shop from eligible loot on the Steam Community Market. Check the specific product and any trade restrictions in their current interfaces." },
] as const satisfies readonly QuickStep[];

export const browseLinks = [
  { label: "Game overview", href: "/guides/" },
  { label: "Getting started", href: "/guides/getting-started/" },
  { label: "Classes", href: "/guides/classes/" },
  { label: "Official Discord invite", href: "/guides/discord/" },
  { label: "Player-count snapshot", href: "/guides/player-count/" },
  { label: "Profile and User Code", href: "/guides/profile/" },
  { label: "In-app purchases", href: "/guides/in-app-purchases/" },
  { label: "Steam Market", href: "/guides/market/" },
  { label: "Market buying", href: "/guides/market-buying/" },
  { label: "Path of Idle comparison", href: "/guides/vs-path-of-idle/" },
] as const satisfies readonly SiteLink[];

export const homeFaqs = [
  { question: "Is this an official website?", answer: "No. This is an independent fan-made guide hub, not affiliated with New Normal Soft Inc., Steam, or Valve." },
  { question: "Which game does this wiki cover?", answer: "It covers War of Genesis: Idle Loot, Steam App 4891320, the Windows desktop loot RPG. It does not cover Idle Heroes." },
  { question: "Which classes are named in the release update?", answer: "The October 7, 2026 update names Knight, Ranger, and Wizard." },
  { question: "Are there verified public codes for the Steam game?", answer: "No official public codes were confirmed in the supplied October 9, 2026 research. Idle Heroes mobile codes are not used here." },
  { question: "Does idle combat establish rewards with the game closed?", answer: "No. The verified description covers leaving the desktop game running. Closed-client rewards and timers were not confirmed." },
  { question: "Are the displayed references live data?", answer: "No. The research was checked on October 9–10, 2026. Historical announcements and observations are dated; no live popularity or price feed is claimed." },
] as const satisfies readonly HomeFaq[];

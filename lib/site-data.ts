export type SiteHref =
  | "/"
  | "/guides/"
  | "/guides/controls/"
  | "/guides/gear-forging/"
  | "/guides/getting-started/"
  | "/guides/how-to-play/"
  | "/guides/squad-building/"
  | "/guides/world-progress/"
  | "/#browse"
  | "/#crews"
  | "/#dispatches"
  | "/#expeditions"
  | "/#loadouts"
  | "/#overview"
  | "/#quick-start";

export interface HomeStat {
  readonly value: string;
  readonly label: string;
}

export interface SiteLink {
  readonly label: string;
  readonly href: SiteHref;
}

export interface CategoryCard {
  readonly key: string;
  readonly id: string;
  readonly title: string;
  readonly number: string;
  readonly description: string;
  readonly links: readonly SiteLink[];
}

export interface SiteUpdate {
  readonly category: string;
  readonly date: string;
  readonly title: string;
  readonly href: SiteHref;
}

export interface PopularLink extends SiteLink {
  readonly number: string;
}

export interface QuickStep {
  readonly number: string;
  readonly title: string;
  readonly description: string;
}

export interface HomeFaq {
  readonly question: string;
  readonly answer: string;
}

export const stats = [
  { value: "5", label: "Layers" },
  { value: "480", label: "Routes charted" },
  { value: "4", label: "Crew roles" },
  { value: "Free", label: "Field Manual" },
] as const satisfies readonly HomeStat[];

export const categoryCards = [
  {
    key: "field-guides",
    id: "field-guides",
    title: "Field Guides",
    number: "01",
    description:
      "Plain-language references for setup, controls, core systems, and the decisions that shape a safe first descent.",
    links: [
      { label: "Getting started", href: "/guides/getting-started/" },
      { label: "How to play", href: "/guides/how-to-play/" },
    ],
  },
  {
    key: "crews",
    id: "crews",
    title: "Crews",
    number: "02",
    description:
      "Build dependable rotations around four practical roles, then keep every delver useful between expeditions.",
    links: [
      { label: "Crew building", href: "/guides/squad-building/" },
      { label: "Quick start", href: "/#quick-start" },
    ],
  },
  {
    key: "loadouts",
    id: "loadouts",
    title: "Loadouts",
    number: "03",
    description:
      "Match tools to route pressure, protect shared equipment, and spend forge materials where they change outcomes.",
    links: [
      { label: "Gear and forge", href: "/guides/gear-forging/" },
      { label: "Crew roles", href: "/#crews" },
    ],
  },
  {
    key: "expeditions",
    id: "expeditions",
    title: "Expeditions",
    number: "04",
    description:
      "Read layer signals, choose a return window, and turn uncertain chambers into repeatable routes.",
    links: [
      { label: "World progress", href: "/guides/world-progress/" },
      { label: "Game overview", href: "/#overview" },
    ],
  },
  {
    key: "dispatches",
    id: "dispatches-hub",
    title: "Dispatches",
    number: "05",
    description:
      "Recent field revisions gathered in one place, from control notes to updated crew and workshop practices.",
    links: [
      { label: "Latest updates", href: "/#dispatches" },
      { label: "Browse guides", href: "/guides/" },
    ],
  },
  {
    key: "workshop",
    id: "workshop",
    title: "Workshop",
    number: "06",
    description:
      "Keep the forge queue useful, recover materials deliberately, and leave room for the repairs a route may demand.",
    links: [
      { label: "Forge reference", href: "/guides/gear-forging/" },
      { label: "Browse everything", href: "/#browse" },
    ],
  },
] as const satisfies readonly CategoryCard[];

export const updates = [
  {
    category: "Field Guide",
    date: "2026-09-17",
    title: "A complete route through Emberdeep's expedition loop",
    href: "/guides/how-to-play/",
  },
  {
    category: "Setup",
    date: "2026-09-16",
    title: "A calmer overlay layout for active descents",
    href: "/guides/controls/",
  },
  {
    category: "Crews",
    date: "2026-09-15",
    title: "Four roles that keep a rotation ready",
    href: "/guides/squad-building/",
  },
  {
    category: "Workshop",
    date: "2026-09-14",
    title: "Forge priorities for shared expedition gear",
    href: "/guides/gear-forging/",
  },
  {
    category: "First Descent",
    date: "2026-09-13",
    title: "A five-step checklist for a fresh field record",
    href: "/guides/getting-started/",
  },
  {
    category: "World",
    date: "2026-09-12",
    title: "How to read the five layers before advancing",
    href: "/guides/world-progress/",
  },
] as const satisfies readonly SiteUpdate[];

function assertIsoDate(value: string, source: string): void {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error(`${source} must be a valid ISO date in YYYY-MM-DD format`);
  }

  const parsedDate = new Date(`${value}T00:00:00.000Z`);
  if (
    Number.isNaN(parsedDate.getTime()) ||
    parsedDate.toISOString().slice(0, 10) !== value
  ) {
    throw new Error(`${source} must be a valid ISO calendar date`);
  }
}

function validateSiteData(): void {
  updates.forEach((update, index) => {
    assertIsoDate(update.date, `updates[${index}].date`);
  });
}

validateSiteData();

export const popular = [
  {
    number: "01",
    label: "Getting Started",
    href: "/guides/getting-started/",
  },
  {
    number: "02",
    label: "How to Play Emberdeep",
    href: "/guides/how-to-play/",
  },
  {
    number: "03",
    label: "Crew Building",
    href: "/guides/squad-building/",
  },
  {
    number: "04",
    label: "Gear and Forge",
    href: "/guides/gear-forging/",
  },
  {
    number: "05",
    label: "World Progress",
    href: "/guides/world-progress/",
  },
  {
    number: "06",
    label: "Overlay Controls",
    href: "/guides/controls/",
  },
] as const satisfies readonly PopularLink[];

export const quickSteps = [
  {
    number: "01",
    title: "Read the route",
    description:
      "Begin with the getting-started guide and learn what the map reveals before committing a crew. A few minutes spent reading route marks will prevent expensive repairs, confused formations, and avoidable Resolve loss during the first expedition.",
  },
  {
    number: "02",
    title: "Name each role",
    description:
      "Identify a point, anchor, specialist, and keeper before selecting equipment. Recruits can cover more than one duty, but every essential job needs a backup so one injury or blocked action does not collapse the entire descent.",
  },
  {
    number: "03",
    title: "Pack for pressure",
    description:
      "Choose tools for the forecasted obstacle instead of chasing the largest stat. Carry one dependable answer for darkness, treatment, protection, mechanisms, or clearing materials, then reserve enough supply capacity to retreat without sacrificing the crew's recovery cycle.",
  },
  {
    number: "04",
    title: "Set a return window",
    description:
      "Decide the minimum reward and lowest safe Resolve before departure. Returning on schedule keeps another crew ready, protects workshop capacity, and turns retreat into a planned resource decision rather than a desperate response to the final chamber.",
  },
  {
    number: "05",
    title: "Record one lesson",
    description:
      "After the crew returns, note the choice that helped or failed, queue one necessary workshop job, and mark the next destination. Small, specific records make later sessions easier to resume and keep upgrades tied to real expedition problems.",
  },
] as const satisfies readonly QuickStep[];

export const browseLinks = [
  { label: "All field guides", href: "/guides/" },
  { label: "Getting started", href: "/guides/getting-started/" },
  { label: "How to play", href: "/guides/how-to-play/" },
  { label: "Overlay controls", href: "/guides/controls/" },
  { label: "Crew building", href: "/guides/squad-building/" },
  { label: "Gear and forge", href: "/guides/gear-forging/" },
  { label: "World progress", href: "/guides/world-progress/" },
  { label: "Game overview", href: "/#overview" },
  { label: "Crew hub", href: "/#crews" },
  { label: "Loadout hub", href: "/#loadouts" },
  { label: "Expedition hub", href: "/#expeditions" },
  { label: "Latest dispatches", href: "/#dispatches" },
] as const satisfies readonly SiteLink[];

export const homeFaqs = [
  {
    question: "What is the Emberdeep Codex?",
    answer:
      "It is an independent, free field manual that organizes practical explanations for Emberdeep's routes, crews, equipment, progression, and overlay controls.",
  },
  {
    question: "Where should a new player begin?",
    answer:
      "Start with Getting Started, complete one short descent, and then use How to Play to connect the map, crew rotation, workshop, and layer systems.",
  },
  {
    question: "Do I need to read every guide first?",
    answer:
      "No. Read only enough to make the next decision. The focused guides are designed to answer a specific field question without turning preparation into homework.",
  },
  {
    question: "How are routes and layers organized?",
    answer:
      "The five layers introduce different pressures, while individual routes combine hazards, rewards, and uncertainty. World Progress explains when a deeper layer is a sensible risk.",
  },
  {
    question: "Why does crew rotation matter?",
    answer:
      "A rotation keeps one crew active, one recovering, and one ready. That rhythm prevents a difficult return from stalling every expedition at once.",
  },
  {
    question: "Are the dispatch dates game patch notes?",
    answer:
      "No. They record revisions to this field manual. Each dispatch points to the guide that received the relevant clarification or expanded field advice.",
  },
  {
    question: "Is this an official studio website?",
    answer:
      "No. Emberdeep Codex is an independent reference project and is not affiliated with a game studio or publisher.",
  },
] as const satisfies readonly HomeFaq[];

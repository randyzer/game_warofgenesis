export type StaticPageType = "about" | "privacy" | "terms";

export interface StaticPageCopy {
  intro: string;
  reviewNotice?: string;
  sections: Array<{
    heading: string;
    paragraphs: string[];
  }>;
}

const staticPageCopy = {
  about: {
    intro:
      "War of Genesis Wiki is a decision-support reference for [WoG] War of Genesis: Idle Loot players making farming, equipment, build, and trading choices.",
    sections: [
      {
        heading: "Sources before claims",
        paragraphs: [
          "Every factual record carries a source URL, access date, evidence note, and confidence level. Community observations can inform analysis, but they are never silently presented as official facts.",
        ],
      },
      {
        heading: "Facts live once",
        paragraphs: [
          "Patch-sensitive values live in structured fact files. Entity pages, databases, guides, and tools reuse that source instead of copying numbers across unrelated documents.",
        ],
      },
      {
        heading: "Publishing is a deliberate gate",
        paragraphs: [
          "A page appears only after its inventory record is public, published, implemented, and allowed by its feature flag. Facts alone never create thin pages.",
        ],
      },
    ],
  },
  privacy: {
    intro:
      "War of Genesis Wiki is an unofficial community site. It is currently static, requires no account or login, and does not intentionally collect visitor profile information.",
    sections: [
      {
        heading: "Information you provide",
        paragraphs: [
          "The site does not currently provide account registration, contact forms, comments, or other fields intended to collect personal information. Search runs within the published site index and is not sent to an external search service.",
        ],
      },
      {
        heading: "Site measurement and advertising",
        paragraphs: [
          "Behavioral analytics and advertising are not currently enabled. The site does not use advertising pixels or an ad network in its published interface.",
        ],
      },
      {
        heading: "Ordinary technical requests",
        paragraphs: [
          "Infrastructure used to deliver and protect the site may process ordinary technical request data, such as IP addresses, request headers, and diagnostic events. This policy does not claim a specific log-retention period.",
        ],
      },
      {
        heading: "External sources and links",
        paragraphs: [
          "Evidence links lead to third-party sites with their own policies. Visiting those services is governed by the destination provider, not War of Genesis Wiki.",
        ],
      },
      {
        heading: "Policy changes",
        paragraphs: [
          "This page will be updated if the site's data practices materially change, including if accounts, forms, analytics, advertising, or other data-processing features are introduced.",
        ],
      },
    ],
  },
  terms: {
    intro:
      "War of Genesis Wiki is an unofficial, fan-operated information and tool site for [WoG] War of Genesis: Idle Loot. Using the site does not create an affiliation with the game's developer, publisher, Steam, or Valve.",
    sections: [
      {
        heading: "Informational use",
        paragraphs: [
          "Guides and decision frameworks are provided for general informational use. Game balance, item availability, market behavior, and platform rules can change after publication; the current game and Steam interfaces remain authoritative.",
        ],
      },
      {
        heading: "Calculator estimates",
        paragraphs: [
          "The Steam Market fee calculator provides an informational estimate based on its displayed assumptions and verification date. Review the final values shown by Steam before listing. Nothing on this site is financial or investment advice.",
        ],
      },
      {
        heading: "Names, marks, and source material",
        paragraphs: [
          "Game names, trademarks, platform names, and third-party assets belong to their respective owners. References to them identify the subject of the site's independent commentary and tools and do not imply endorsement.",
        ],
      },
      {
        heading: "Availability and changes",
        paragraphs: [
          "Site content may be corrected, updated, or removed as the game, Steam, available evidence, or the site itself changes. The site does not guarantee that game data, market conditions, routes, or tools will remain available or unchanged.",
        ],
      },
    ],
  },
} satisfies Record<StaticPageType, StaticPageCopy>;

export function getStaticPageCopy(pageType: StaticPageType): StaticPageCopy {
  return staticPageCopy[pageType];
}

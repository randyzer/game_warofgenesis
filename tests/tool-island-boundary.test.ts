import { experimental_AstroContainer as AstroContainer } from "astro/container";
import React from "react";
import { renderToString } from "react-dom/server";

import { describe, expect, it } from "vitest";

import ToolShell from "../src/components/ToolShell.astro";
import { pageInventory } from "../src/core/site-data";
import type { CalculatorDefinition } from "../src/data/schemas/tools";

const internalMarker = "INTERNAL_TOOL_EVIDENCE_LEAK_MARKER";

const calculator: CalculatorDefinition = {
  kind: "calculator",
  id: "damage-calculator",
  name: "Damage Calculator",
  description: "A calculator fixture that exercises the hydrated tool boundary.",
  patch: "1.0",
  updatedAt: "2026-09-08",
  confidence: "high",
  sources: [
    {
      sourceUrl: "https://example.com/tool-source",
      sourceType: "official",
      accessedAt: "2026-09-08",
      evidenceNote: `${internalMarker} retained for internal validation only.`,
    },
  ],
  resultLabel: "Damage",
  resultUnit: "HP",
  precision: 0,
  inputs: [
    {
      id: "base-damage",
      label: "Base damage",
      min: 0,
      max: 500,
      step: 1,
      defaultValue: 100,
    },
  ],
  formula: { kind: "input", inputId: "base-damage" },
};

describe("tool island public serialization boundary", () => {
  it("keeps internal source evidence out of hydrated ToolShell output", async () => {
    expect(calculator.sources[0].evidenceNote).toContain(internalMarker);

    const container = await AstroContainer.create();
    container.addServerRenderer({
      renderer: {
        name: "@astrojs/react",
        check: async () => true,
        async renderToStaticMarkup(Component, props) {
          return {
            attrs: {},
            html: renderToString(React.createElement(Component, props)),
          };
        },
      },
    });
    container.addClientRenderer({
      name: "@astrojs/react",
      entrypoint: "@astrojs/react/client.js",
    });
    const html = await container.renderToString(ToolShell, {
      props: {
        page: {
          ...pageInventory[0],
          pageId: "tool.damage-calculator",
          route: "/tools/damage-calculator/",
          pageType: "calculator",
          module: "calculator",
          feature: "calculator",
          title: "Damage Calculator",
          description: "Calculate deterministic fixture damage from reviewed inputs.",
          relatedPageIds: [],
        },
        definition: calculator,
      },
    });

    expect(html).toContain("https://example.com/tool-source");
    expect(html).toContain("<astro-island");
    expect(html).toContain("damage-calculator");
    expect(html).not.toContain(internalMarker);
    expect(html).not.toContain("evidenceNote");
  });
});

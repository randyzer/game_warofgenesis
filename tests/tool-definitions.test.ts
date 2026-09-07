import {
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import {
  decodeCalculatorState,
  decodePlannerState,
  encodeCalculatorState,
  encodePlannerState,
  evaluateCalculator,
  normalizeCalculatorInputs,
  validatePlannerSelection,
} from "../src/core/tool-definitions";
import { loadToolDefinition } from "../src/core/tool-loader";
import {
  parseToolDefinition,
  type CalculatorDefinition,
  type PlannerDefinition,
} from "../src/data/schemas/tools";

const source = {
  sourceUrl: "https://game.example/tools/reference",
  sourceType: "official" as const,
  accessedAt: "2026-09-01",
  evidenceNote: "Validation-only source attached to the test tool definition.",
};

const calculator: CalculatorDefinition = {
  kind: "calculator",
  id: "damage-calculator",
  name: "Damage Calculator",
  description: "A validation-only calculator used to prove safe formula evaluation.",
  patch: "1.0",
  updatedAt: "2026-09-01",
  confidence: "high",
  sources: [source],
  resultLabel: "Damage",
  resultUnit: "HP",
  precision: 1,
  inputs: [
    {
      id: "base-damage",
      label: "Base damage",
      min: 0,
      max: 500,
      step: 1,
      defaultValue: 100,
    },
    {
      id: "multiplier",
      label: "Multiplier",
      min: 0,
      max: 5,
      step: 0.1,
      defaultValue: 1,
    },
  ],
  formula: {
    kind: "multiply",
    operands: [
      { kind: "input", inputId: "base-damage" },
      { kind: "input", inputId: "multiplier" },
    ],
  },
};

const planner: PlannerDefinition = {
  kind: "planner",
  id: "build-planner",
  name: "Build Planner",
  description: "A validation-only planner used to prove deterministic local state.",
  patch: "1.0",
  updatedAt: "2026-09-01",
  confidence: "medium",
  sources: [source],
  slots: [
    {
      id: "primary",
      label: "Primary",
      required: true,
      options: [
        { id: "rifle", label: "Rifle" },
        { id: "bow", label: "Bow" },
      ],
    },
    {
      id: "support",
      label: "Support",
      required: false,
      options: [{ id: "shield", label: "Shield" }],
    },
  ],
};

const temporaryDirectories: string[] = [];

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    rmSync(directory, { recursive: true, force: true });
  }
});

describe("tool definitions", () => {
  it("parses valid calculators and rejects unknown formula inputs", () => {
    expect(parseToolDefinition(calculator).kind).toBe("calculator");
    expect(() =>
      parseToolDefinition({
        ...calculator,
        formula: { kind: "input", inputId: "missing-input" },
      }),
    ).toThrow(/missing-input/i);
  });

  it("bounds numeric inputs and evaluates a safe operation tree", () => {
    expect(
      normalizeCalculatorInputs(calculator, {
        "base-damage": 900,
        multiplier: Number.NaN,
      }),
    ).toEqual({ "base-damage": 500, multiplier: 1 });
    expect(
      evaluateCalculator(calculator, {
        "base-damage": 120,
        multiplier: 1.5,
      }),
    ).toBe(180);
  });

  it("rejects division by zero instead of returning a non-finite result", () => {
    const division = parseToolDefinition({
      ...calculator,
      formula: {
        kind: "divide",
        left: { kind: "constant", value: 10 },
        right: { kind: "constant", value: 0 },
      },
    });

    expect(division.kind).toBe("calculator");
    if (division.kind === "calculator") {
      expect(() => evaluateCalculator(division, {})).toThrow(/zero/i);
    }
  });

  it("round-trips bounded calculator state through a stable fragment", () => {
    expect(
      encodeCalculatorState({ multiplier: 1.5, "base-damage": 120 }),
    ).toBe("#base-damage=120&multiplier=1.5");
    expect(
      decodeCalculatorState(
        "#base-damage=900&multiplier=not-a-number",
        calculator,
      ),
    ).toEqual({ "base-damage": 500, multiplier: 1 });
  });

  it("encodes planner state deterministically and ignores invalid options", () => {
    expect(
      encodePlannerState({ support: "shield", primary: "rifle" }),
    ).toBe("#primary=rifle&support=shield");
    expect(
      decodePlannerState("#support=invalid&primary=bow", planner),
    ).toEqual({ primary: "bow" });
    expect(validatePlannerSelection(planner, {})).toEqual([
      "Select an option for Primary.",
    ]);
  });

  it("loads only the requested, validated tool definition", () => {
    const project = mkdtempSync(join(tmpdir(), "game-site-tools-"));
    temporaryDirectories.push(project);
    const toolsDirectory = join(project, "src/data/tools");
    mkdirSync(toolsDirectory, { recursive: true });
    writeFileSync(
      join(toolsDirectory, "damage-calculator.json"),
      JSON.stringify(calculator),
      "utf8",
    );

    expect(
      loadToolDefinition("damage-calculator", "calculator", project).id,
    ).toBe("damage-calculator");
    expect(() =>
      loadToolDefinition("build-planner", "planner", project),
    ).toThrow(/build-planner\.json/i);
  });
});

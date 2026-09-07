import { z } from "zod";

import {
  confidenceSchema,
  isoDateSchema,
  provenanceSchema,
} from "./provenance";

const toolKeySchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export type FormulaNode =
  | { kind: "constant"; value: number }
  | { kind: "input"; inputId: string }
  | {
      kind: "add" | "multiply" | "min" | "max";
      operands: FormulaNode[];
    }
  | { kind: "subtract" | "divide"; left: FormulaNode; right: FormulaNode };

export const formulaNodeSchema: z.ZodType<FormulaNode> = z.lazy(() =>
  z.discriminatedUnion("kind", [
    z.object({ kind: z.literal("constant"), value: z.number() }).strict(),
    z.object({ kind: z.literal("input"), inputId: toolKeySchema }).strict(),
    z
      .object({
        kind: z.enum(["add", "multiply", "min", "max"]),
        operands: z.array(formulaNodeSchema).min(2).max(12),
      })
      .strict(),
    z
      .object({
        kind: z.enum(["subtract", "divide"]),
        left: formulaNodeSchema,
        right: formulaNodeSchema,
      })
      .strict(),
  ]),
);

const numericInputSchema = z
  .object({
    id: toolKeySchema,
    label: z.string().trim().min(2).max(80),
    unit: z.string().trim().min(1).max(20).optional(),
    min: z.number(),
    max: z.number(),
    step: z.number().positive(),
    defaultValue: z.number(),
  })
  .strict()
  .superRefine((input, context) => {
    if (input.min >= input.max) {
      context.addIssue({
        code: "custom",
        message: `Input "${input.id}" min must be lower than max.`,
        path: ["min"],
      });
    }
    if (input.defaultValue < input.min || input.defaultValue > input.max) {
      context.addIssue({
        code: "custom",
        message: `Input "${input.id}" defaultValue must be within its bounds.`,
        path: ["defaultValue"],
      });
    }
  });

const toolBaseShape = {
  id: toolKeySchema,
  name: z.string().trim().min(2).max(80),
  description: z.string().trim().min(30).max(240),
  patch: z.string().trim().min(1).max(40),
  updatedAt: isoDateSchema,
  confidence: confidenceSchema,
  sources: z.array(provenanceSchema).min(1),
};

function walkFormula(
  node: FormulaNode,
  visit: (node: FormulaNode, depth: number) => void,
  depth = 1,
) {
  visit(node, depth);
  if ("operands" in node) {
    for (const operand of node.operands) walkFormula(operand, visit, depth + 1);
  } else if ("left" in node) {
    walkFormula(node.left, visit, depth + 1);
    walkFormula(node.right, visit, depth + 1);
  }
}

export const calculatorDefinitionSchema = z
  .object({
    ...toolBaseShape,
    kind: z.literal("calculator"),
    resultLabel: z.string().trim().min(2).max(80),
    resultUnit: z.string().trim().min(1).max(20).optional(),
    precision: z.number().int().min(0).max(6),
    inputs: z.array(numericInputSchema).min(1).max(24),
    formula: formulaNodeSchema,
  })
  .strict()
  .superRefine((definition, context) => {
    const inputIds = new Set<string>();
    definition.inputs.forEach((input, index) => {
      if (inputIds.has(input.id)) {
        context.addIssue({
          code: "custom",
          message: `Duplicate calculator input: ${input.id}`,
          path: ["inputs", index, "id"],
        });
      }
      inputIds.add(input.id);
    });

    walkFormula(definition.formula, (node, depth) => {
      if (depth > 16) {
        context.addIssue({
          code: "custom",
          message: "Calculator formula cannot exceed 16 levels.",
          path: ["formula"],
        });
      }
      if (node.kind === "input" && !inputIds.has(node.inputId)) {
        context.addIssue({
          code: "custom",
          message: `Formula references unknown input: ${node.inputId}`,
          path: ["formula"],
        });
      }
    });
  });

const plannerOptionSchema = z
  .object({
    id: toolKeySchema,
    label: z.string().trim().min(2).max(80),
    description: z.string().trim().min(8).max(180).optional(),
  })
  .strict();

const plannerSlotSchema = z
  .object({
    id: toolKeySchema,
    label: z.string().trim().min(2).max(80),
    required: z.boolean(),
    options: z.array(plannerOptionSchema).min(1).max(100),
  })
  .strict()
  .superRefine((slot, context) => {
    const optionIds = new Set<string>();
    slot.options.forEach((option, index) => {
      if (optionIds.has(option.id)) {
        context.addIssue({
          code: "custom",
          message: `Duplicate option in ${slot.id}: ${option.id}`,
          path: ["options", index, "id"],
        });
      }
      optionIds.add(option.id);
    });
  });

export const plannerDefinitionSchema = z
  .object({
    ...toolBaseShape,
    kind: z.literal("planner"),
    slots: z.array(plannerSlotSchema).min(1).max(24),
  })
  .strict()
  .superRefine((definition, context) => {
    const slotIds = new Set<string>();
    definition.slots.forEach((slot, index) => {
      if (slotIds.has(slot.id)) {
        context.addIssue({
          code: "custom",
          message: `Duplicate planner slot: ${slot.id}`,
          path: ["slots", index, "id"],
        });
      }
      slotIds.add(slot.id);
    });
  });

export const toolDefinitionSchema = z.union([
  calculatorDefinitionSchema,
  plannerDefinitionSchema,
]);

export type CalculatorDefinition = z.output<typeof calculatorDefinitionSchema>;
export type PlannerDefinition = z.output<typeof plannerDefinitionSchema>;
export type ToolDefinition = z.output<typeof toolDefinitionSchema>;

export function parseToolDefinition(input: unknown): ToolDefinition {
  return toolDefinitionSchema.parse(input);
}

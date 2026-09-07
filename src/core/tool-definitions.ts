import {
  type CalculatorDefinition,
  type FormulaNode,
  type PlannerDefinition,
} from "../data/schemas/tools";

export function normalizeCalculatorInputs(
  definition: CalculatorDefinition,
  values: Record<string, number>,
): Record<string, number> {
  return Object.fromEntries(
    definition.inputs.map((input) => {
      const candidate = values[input.id];
      const finiteValue = Number.isFinite(candidate)
        ? candidate
        : input.defaultValue;
      return [input.id, Math.min(input.max, Math.max(input.min, finiteValue))];
    }),
  );
}

function evaluateNode(
  node: FormulaNode,
  values: Record<string, number>,
): number {
  let result: number;

  switch (node.kind) {
    case "constant":
      result = node.value;
      break;
    case "input":
      result = values[node.inputId];
      break;
    case "add":
      result = node.operands.reduce(
        (total, operand) => total + evaluateNode(operand, values),
        0,
      );
      break;
    case "multiply":
      result = node.operands.reduce(
        (total, operand) => total * evaluateNode(operand, values),
        1,
      );
      break;
    case "min":
      result = Math.min(...node.operands.map((operand) => evaluateNode(operand, values)));
      break;
    case "max":
      result = Math.max(...node.operands.map((operand) => evaluateNode(operand, values)));
      break;
    case "subtract":
      result = evaluateNode(node.left, values) - evaluateNode(node.right, values);
      break;
    case "divide": {
      const denominator = evaluateNode(node.right, values);
      if (denominator === 0) throw new Error("Calculator formula cannot divide by zero.");
      result = evaluateNode(node.left, values) / denominator;
      break;
    }
  }

  if (!Number.isFinite(result)) {
    throw new Error("Calculator formula produced a non-finite result.");
  }
  return result;
}

export function evaluateCalculator(
  definition: CalculatorDefinition,
  values: Record<string, number>,
): number {
  const normalized = normalizeCalculatorInputs(definition, values);
  return Number(evaluateNode(definition.formula, normalized).toFixed(definition.precision));
}

export function encodeCalculatorState(values: Record<string, number>): string {
  const entries = Object.entries(values)
    .filter(([, value]) => Number.isFinite(value))
    .sort(([left], [right]) => left.localeCompare(right, "en"))
    .map(([key, value]): [string, string] => [key, String(value)]);
  if (entries.length === 0) return "";

  return `#${new URLSearchParams(entries).toString()}`;
}

export function decodeCalculatorState(
  fragment: string,
  definition: CalculatorDefinition,
): Record<string, number> {
  const parameters = new URLSearchParams(fragment.replace(/^#/, ""));
  const values = Object.fromEntries(
    definition.inputs.map((input) => [
      input.id,
      Number(parameters.get(input.id) ?? Number.NaN),
    ]),
  );
  return normalizeCalculatorInputs(definition, values);
}

export function encodePlannerState(state: Record<string, string>): string {
  const entries = Object.entries(state)
    .filter(([, value]) => value.length > 0)
    .sort(([left], [right]) => left.localeCompare(right, "en"));
  if (entries.length === 0) return "";

  return `#${new URLSearchParams(entries).toString()}`;
}

export function decodePlannerState(
  fragment: string,
  definition: PlannerDefinition,
): Record<string, string> {
  const parameters = new URLSearchParams(fragment.replace(/^#/, ""));
  return Object.fromEntries(
    definition.slots.flatMap((slot) => {
      const selected = parameters.get(slot.id);
      return selected && slot.options.some((option) => option.id === selected)
        ? [[slot.id, selected] as const]
        : [];
    }),
  );
}

export function validatePlannerSelection(
  definition: PlannerDefinition,
  state: Record<string, string>,
): string[] {
  return definition.slots.flatMap((slot) => {
    const selected = state[slot.id];
    if (!selected) {
      return slot.required ? [`Select an option for ${slot.label}.`] : [];
    }
    return slot.options.some((option) => option.id === selected)
      ? []
      : [`Select a valid option for ${slot.label}.`];
  });
}

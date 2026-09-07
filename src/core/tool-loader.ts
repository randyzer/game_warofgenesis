import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  parseToolDefinition,
  type ToolDefinition,
} from "../data/schemas/tools";

export function loadToolDefinition(
  slug: string,
  kind: "calculator" | "planner",
  projectRoot = process.cwd(),
): ToolDefinition {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error(`Invalid tool slug: ${slug}`);
  }

  const relativePath = `src/data/tools/${slug}.json`;
  const filePath = resolve(projectRoot, relativePath);
  if (!existsSync(filePath)) {
    throw new Error(`Enabled tool "${slug}" requires ${relativePath}.`);
  }

  let input: unknown;
  try {
    input = JSON.parse(readFileSync(filePath, "utf8"));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Invalid ${relativePath}: ${message}`, { cause: error });
  }

  try {
    const definition = parseToolDefinition(input);
    if (definition.id !== slug || definition.kind !== kind) {
      throw new Error(
        `Expected ${kind} definition "${slug}", received ${definition.kind} "${definition.id}".`,
      );
    }
    return definition;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Invalid ${relativePath}: ${message}`, { cause: error });
  }
}

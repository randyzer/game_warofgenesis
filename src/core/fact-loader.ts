import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import type { GameConfig } from "../config/schema";
import {
  getEntityModuleDefinition,
  type EntityFactModule,
  type EntityFactsFor,
} from "../data/entity-modules";

export function loadFactModule<TModule extends EntityFactModule>(
  module: TModule,
  config: GameConfig,
  projectRoot = process.cwd(),
): EntityFactsFor<TModule> {
  if (!config.features[module]) {
    return [] as EntityFactsFor<TModule>;
  }

  const relativePath = `src/data/facts/${module}.json`;
  const filePath = resolve(projectRoot, relativePath);
  if (!existsSync(filePath)) {
    throw new Error(`Enabled module "${module}" requires ${relativePath}.`);
  }

  let input: unknown;
  try {
    input = JSON.parse(readFileSync(filePath, "utf8"));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Invalid ${relativePath}: ${message}`, { cause: error });
  }

  try {
    return getEntityModuleDefinition(module).parse(input) as EntityFactsFor<TModule>;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Invalid ${relativePath}: ${message}`, { cause: error });
  }
}

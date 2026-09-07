import gameConfig from "../../game.config";

import type { GameConfig } from "./schema";

export function loadGameConfig(): GameConfig {
  return gameConfig;
}

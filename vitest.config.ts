/// <reference types="vitest/config" />
import { getViteConfig } from "astro/config";

export default getViteConfig(
  {
    oxc: { jsx: { runtime: "automatic" } },
    test: { include: ["tests/**/*.test.ts"] },
  },
  { configFile: false },
);

import { readdirSync } from "node:fs";
import { join, relative, sep } from "node:path";

import type { PageInventoryEntry } from "../data/schemas/page-inventory";

export function routeToOutputFile(route: string): string {
  if (route === "/") return "index.html";
  if (route === "/404.html") return "404.html";
  if (!/^\/(?:[a-z0-9]+(?:-[a-z0-9]+)*\/)+$/.test(route)) {
    throw new Error(`Cannot map unsupported inventory route: ${route}`);
  }

  return `${route.slice(1)}index.html`;
}

function listHtmlFiles(directory: string, root = directory): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = join(directory, entry.name);
    if (entry.isDirectory()) return listHtmlFiles(absolutePath, root);
    if (!entry.isFile() || !entry.name.endsWith(".html")) return [];

    return [relative(root, absolutePath).split(sep).join("/")];
  });
}

function outputFileToRoute(outputFile: string): string {
  if (outputFile === "index.html") return "/";
  if (outputFile === "404.html") return "/404.html";
  if (outputFile.endsWith("/index.html")) {
    return `/${outputFile.slice(0, -"index.html".length)}`;
  }

  return `/${outputFile}`;
}

export function collectOutputReconciliationErrors(
  enabledPages: PageInventoryEntry[],
  outputDirectory: string,
): string[] {
  const expectedRoutes = new Set(enabledPages.map((page) => page.route));
  const actualRoutes = new Set(
    listHtmlFiles(outputDirectory).map(outputFileToRoute),
  );
  const errors: string[] = [];

  for (const page of enabledPages) {
    if (!actualRoutes.has(page.route)) {
      errors.push(`Missing HTML output for inventory route: ${page.route}`);
    }
  }

  for (const route of [...actualRoutes].sort()) {
    if (!expectedRoutes.has(route)) {
      errors.push(`Unregistered HTML output found: ${route}`);
    }
  }

  return errors;
}

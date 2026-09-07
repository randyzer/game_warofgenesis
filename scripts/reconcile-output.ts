import { resolve } from "node:path";

import { collectOutputReconciliationErrors } from "../src/core/output-reconciliation";
import { enabledPageCatalog } from "../src/core/site-data";

const outputDirectory = resolve(process.cwd(), "dist");
const errors = collectOutputReconciliationErrors(
  enabledPageCatalog,
  outputDirectory,
);

if (errors.length > 0) {
  console.error("Static output reconciliation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(
    `Static output reconciliation passed: ${enabledPageCatalog.length} inventory routes matched.`,
  );
}

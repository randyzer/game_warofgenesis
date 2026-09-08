import { existsSync } from "node:fs";
import { resolve } from "node:path";

import type { PageInventoryEntry } from "../data/schemas/page-inventory";

export type MediaNeed =
  | "HIGH PRIORITY"
  | "RECOMMENDED"
  | "OPTIONAL"
  | "NO MEDIA NEEDED";
export type CandidateState =
  | "NOT FOUND"
  | "FOUND"
  | "SEMANTICALLY VERIFIED";
export type RightsState =
  | "VERIFIED"
  | "UNRESOLVED"
  | "HUMAN RISK ACCEPTED"
  | "NOT REQUIRED FOR EMBED";
export type HumanDecision = "APPROVED" | "WAIVED" | "REVISE" | "BLOCK" | "PENDING";
export type IntegrationState = "NOT INTEGRATED" | "INTEGRATED" | "FALLBACK ONLY";
export type VisualGateState = "PENDING" | "PASS" | "REVISE" | "BLOCK";

export interface MediaReadinessDecision {
  pageIdOrRoute: string;
  pageFamily: string;
  mediaNeed: MediaNeed;
  needRationale: string;
  intendedPlacement: string;
  candidateState: CandidateState;
  rightsState: RightsState;
  humanDecision: HumanDecision;
  integrationState: IntegrationState;
  visualGateState: VisualGateState;
  sourceOrProvenance: string;
  ownerOrDeferReason: string;
  notes: string;
  lineNumber: number;
}

export interface MediaReadinessSignals {
  errors: string[];
  warnings: string[];
  info: string[];
}

export interface MediaReadinessInput {
  inventory: PageInventoryEntry[];
  decisions?: MediaReadinessDecision[];
}

export interface MediaDecisionTableParseResult {
  decisions: MediaReadinessDecision[];
  errors: string[];
}

export type MediaDecisionTableSource = "docs" | "root" | "none" | "duplicate";

export interface MediaDecisionTableLocation {
  source: MediaDecisionTableSource;
  path?: string;
  errors: string[];
}

const mediaNeeds: MediaNeed[] = [
  "HIGH PRIORITY",
  "RECOMMENDED",
  "OPTIONAL",
  "NO MEDIA NEEDED",
];
const candidateStates: CandidateState[] = [
  "NOT FOUND",
  "FOUND",
  "SEMANTICALLY VERIFIED",
];
const rightsStates: RightsState[] = [
  "VERIFIED",
  "UNRESOLVED",
  "HUMAN RISK ACCEPTED",
  "NOT REQUIRED FOR EMBED",
];
const humanDecisions: HumanDecision[] = [
  "APPROVED",
  "WAIVED",
  "REVISE",
  "BLOCK",
  "PENDING",
];
const integrationStates: IntegrationState[] = [
  "NOT INTEGRATED",
  "INTEGRATED",
  "FALLBACK ONLY",
];
const visualGateStates: VisualGateState[] = [
  "PENDING",
  "PASS",
  "REVISE",
  "BLOCK",
];

const canonicalHeaders = [
  "pageId_or_route",
  "page_family",
  "media_need",
  "need_rationale",
  "intended_placement",
  "candidate_state",
  "rights_state",
  "human_decision",
  "integration_state",
  "visual_gate_state",
  "source_or_provenance",
  "owner_or_defer_reason",
  "notes",
] as const;

type CanonicalHeader = (typeof canonicalHeaders)[number];
const canonicalHeaderSet = new Set<string>(canonicalHeaders);
const unconditionallyRequiredHeaders = [
  "pageId_or_route",
  "page_family",
  "media_need",
  "need_rationale",
  "intended_placement",
  "candidate_state",
  "rights_state",
  "human_decision",
  "integration_state",
  "visual_gate_state",
  "source_or_provenance",
  "owner_or_defer_reason",
] as const satisfies readonly CanonicalHeader[];

function normalizeCell(value: string): string {
  return value.replace(/<br\s*\/?>/gi, " ").replace(/\s+/g, " ").trim();
}

function splitMarkdownRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map(normalizeCell);
}

interface MarkdownTableRow {
  cells: string[];
  lineNumber: number;
}

function isSeparatorRow(cells: string[]): boolean {
  return cells.every((cell) => /^:?-{3,}:?$/.test(cell));
}

function listValues(values: readonly string[]): string {
  return values.map((value) => `"${value}"`).join(", ");
}

function exactEnum<T extends string>(
  field: string,
  value: string,
  values: readonly T[],
  rowNumber: number,
  errors: string[],
): T | undefined {
  const parsed = values.find((candidate) => candidate === value);
  if (!parsed) {
    errors.push(
      `MEDIA_DECISION_TABLE.md row ${rowNumber} has unsupported ${field} "${value || "(blank)"}". Supported values: ${listValues(values)}.`,
    );
  }

  return parsed;
}

function hasExplanation(value: string): boolean {
  return normalizeCell(value).length > 0;
}

export function findMediaDecisionTable(projectRoot: string): MediaDecisionTableLocation {
  const docsPath = resolve(projectRoot, "docs", "MEDIA_DECISION_TABLE.md");
  const rootPath = resolve(projectRoot, "MEDIA_DECISION_TABLE.md");
  const hasDocs = existsSync(docsPath);
  const hasRoot = existsSync(rootPath);

  if (hasDocs && hasRoot) {
    return {
      source: "duplicate",
      errors: [
        "Duplicate media decision table authority: both docs/MEDIA_DECISION_TABLE.md and root MEDIA_DECISION_TABLE.md exist. Remove one authority before validation.",
      ],
    };
  }
  if (hasDocs) return { source: "docs", path: docsPath, errors: [] };
  if (hasRoot) return { source: "root", path: rootPath, errors: [] };

  return { source: "none", errors: [] };
}

export function parseMediaDecisionTableMarkdown(markdown: string): MediaDecisionTableParseResult {
  const errors: string[] = [];
  const decisions: MediaReadinessDecision[] = [];

  if (!markdown.trim()) {
    return {
      decisions,
      errors: ["MEDIA_DECISION_TABLE.md is present but empty."],
    };
  }

  const lines = markdown
    .split(/\r?\n/)
    .map((line, index) => ({ line: line.trim(), lineNumber: index + 1 }));
  const rows = lines.flatMap<MarkdownTableRow>(({ line, lineNumber }) =>
    line.startsWith("|") && line.endsWith("|")
      ? [{ cells: splitMarkdownRow(line), lineNumber }]
      : [],
  );

  const candidateHeaderIndices = rows.flatMap((_, index) =>
    rows[index + 1]?.lineNumber === rows[index].lineNumber + 1 &&
    isSeparatorRow(rows[index + 1].cells) ? [index] : [],
  );
  const canonicalHeaderIndices = candidateHeaderIndices.filter((index) =>
    rows[index].cells.length === canonicalHeaders.length &&
    canonicalHeaders.every((header, column) => rows[index].cells[column] === header),
  );
  if (canonicalHeaderIndices.length > 1) {
    return {
      decisions,
      errors: [
        `MEDIA_DECISION_TABLE.md has duplicate canonical lifecycle table authority at header rows ${canonicalHeaderIndices.map((index) => rows[index].lineNumber).join(", ")}; keep exactly one canonical table.`,
      ],
    };
  }
  if (candidateHeaderIndices.length === 0) {
    return {
      decisions,
      errors: [
        `MEDIA_DECISION_TABLE.md must contain a Markdown table with a header row, separator row, and required columns: ${canonicalHeaders.join(", ")}.`,
      ],
    };
  }

  if (canonicalHeaderIndices.length === 0) {
    errors.push(
      `MEDIA_DECISION_TABLE.md is present but contains no canonical lifecycle table; use the exact canonical schema in this order: ${canonicalHeaders.join(", ")}.`,
    );
  }
  // A noncanonical header is inspected only for diagnostics, never for data parsing.
  const headerIndex = canonicalHeaderIndices[0] ?? candidateHeaderIndices[0];
  const headerRow = rows[headerIndex];
  const separatorRow = rows[headerIndex + 1];
  const rawHeaders = headerRow.cells;
  const seenHeaders = new Set<string>();

  if (rawHeaders.length !== canonicalHeaders.length) {
    errors.push(
      `MEDIA_DECISION_TABLE.md header has ${rawHeaders.length} columns; expected exactly ${canonicalHeaders.length}.`,
    );
  }
  if (separatorRow.cells.length !== rawHeaders.length) {
    errors.push(
      `MEDIA_DECISION_TABLE.md separator row ${separatorRow.lineNumber} has ${separatorRow.cells.length} cells; expected ${rawHeaders.length} to match the header.`,
    );
  }

  for (const header of rawHeaders) {
    if (seenHeaders.has(header)) {
      errors.push(`MEDIA_DECISION_TABLE.md has duplicate column: ${header || "(blank)"}.`);
    }
    seenHeaders.add(header);

    if (!canonicalHeaderSet.has(header)) {
      errors.push(
        `MEDIA_DECISION_TABLE.md has unknown or non-authoritative column "${header || "(blank)"}"; use the exact canonical schema.`,
      );
    }
  }

  for (const canonicalHeader of canonicalHeaders) {
    if (!seenHeaders.has(canonicalHeader)) {
      errors.push(`MEDIA_DECISION_TABLE.md is missing required column: ${canonicalHeader}.`);
    }
  }
  if (errors.length > 0) {
    return { decisions, errors };
  }

  const headers = rawHeaders as CanonicalHeader[];
  const dataRows: MarkdownTableRow[] = [];
  for (const { line, lineNumber } of lines.slice(separatorRow.lineNumber)) {
    if (!line) break;

    const hasLeadingPipe = line.startsWith("|");
    const hasTrailingPipe = line.endsWith("|");
    if (!hasLeadingPipe || !hasTrailingPipe) {
      if (line.includes("|")) {
        errors.push(
          `MEDIA_DECISION_TABLE.md has malformed non-empty row ${lineNumber}; data rows require leading and trailing pipe delimiters.`,
        );
        continue;
      }
      break;
    }

    const row = { cells: splitMarkdownRow(line), lineNumber };
    if (!isSeparatorRow(row.cells)) dataRows.push(row);
  }

  for (const row of dataRows) {
    if (row.cells.every((cell) => !cell)) {
      errors.push(
        `MEDIA_DECISION_TABLE.md row ${row.lineNumber} is malformed because all data cells are empty.`,
      );
      continue;
    }

    if (row.cells.length !== headers.length) {
      errors.push(
        `MEDIA_DECISION_TABLE.md row ${row.lineNumber} has ${row.cells.length} cells; expected exactly ${headers.length} to match the header.`,
      );
      continue;
    }

    const byHeader = new Map(headers.map((header, index) => [header, row.cells[index]]));
    const rowErrors: string[] = [];
    for (const requiredHeader of unconditionallyRequiredHeaders) {
      if (!byHeader.get(requiredHeader)) {
        rowErrors.push(
          `MEDIA_DECISION_TABLE.md row ${row.lineNumber} requires ${requiredHeader}.`,
        );
      }
    }
    if (rowErrors.length > 0) {
      errors.push(...rowErrors);
      continue;
    }

    const pageIdOrRoute = byHeader.get("pageId_or_route")!;
    const pageFamily = byHeader.get("page_family")!;
    const mediaNeed = exactEnum(
      "media_need",
      byHeader.get("media_need")!,
      mediaNeeds,
      row.lineNumber,
      rowErrors,
    );
    const candidateState = exactEnum(
      "candidate_state",
      byHeader.get("candidate_state")!,
      candidateStates,
      row.lineNumber,
      rowErrors,
    );
    const rightsState = exactEnum(
      "rights_state",
      byHeader.get("rights_state")!,
      rightsStates,
      row.lineNumber,
      rowErrors,
    );
    const humanDecision = exactEnum(
      "human_decision",
      byHeader.get("human_decision")!,
      humanDecisions,
      row.lineNumber,
      rowErrors,
    );
    const integrationState = exactEnum(
      "integration_state",
      byHeader.get("integration_state")!,
      integrationStates,
      row.lineNumber,
      rowErrors,
    );
    const visualGateState = exactEnum(
      "visual_gate_state",
      byHeader.get("visual_gate_state")!,
      visualGateStates,
      row.lineNumber,
      rowErrors,
    );

    if (rowErrors.length > 0) {
      errors.push(...rowErrors);
      continue;
    }
    if (
      !mediaNeed ||
      !candidateState ||
      !rightsState ||
      !humanDecision ||
      !integrationState ||
      !visualGateState
    ) {
      continue;
    }

    const notes = byHeader.get("notes")!;
    if (!notes) {
      const notesRequirement =
        mediaNeed === "NO MEDIA NEEDED"
          ? "no-media exception"
          : humanDecision !== "WAIVED" && rightsState === "HUMAN RISK ACCEPTED"
            ? "rights risk"
            : humanDecision !== "WAIVED" && integrationState === "FALLBACK ONLY"
              ? "fallback-only media"
              : undefined;
      if (notesRequirement) {
        errors.push(
          `MEDIA_DECISION_TABLE.md row ${row.lineNumber} requires notes for ${notesRequirement}.`,
        );
        continue;
      }
    }

    decisions.push({
      pageIdOrRoute,
      pageFamily,
      mediaNeed,
      needRationale: byHeader.get("need_rationale")!,
      intendedPlacement: byHeader.get("intended_placement")!,
      candidateState,
      rightsState,
      humanDecision,
      integrationState,
      visualGateState,
      sourceOrProvenance: byHeader.get("source_or_provenance")!,
      ownerOrDeferReason: byHeader.get("owner_or_defer_reason")!,
      notes,
      lineNumber: row.lineNumber,
    });
  }

  if (decisions.length === 0 && errors.length === 0) {
    errors.push("MEDIA_DECISION_TABLE.md must contain at least one non-empty data row.");
  }

  return { decisions, errors };
}

function resolveInventoryPage(
  inventory: PageInventoryEntry[],
  decision: MediaReadinessDecision,
): PageInventoryEntry | undefined {
  const matches = inventory.filter(
    (page) => page.pageId === decision.pageIdOrRoute || page.route === decision.pageIdOrRoute,
  );

  if (matches.length === 1) return matches[0];

  return undefined;
}

function collectInventoryResolutionErrors(
  inventory: PageInventoryEntry[],
  decisions: MediaReadinessDecision[],
): string[] {
  const errors: string[] = [];
  const pageResolutionCounts = new Map<string, MediaReadinessDecision[]>();

  for (const decision of decisions) {
    const matches = inventory.filter(
      (page) => page.pageId === decision.pageIdOrRoute || page.route === decision.pageIdOrRoute,
    );

    if (matches.length === 0) {
      errors.push(
        `MEDIA_DECISION_TABLE.md row ${decision.lineNumber} references no Runtime Page Inventory row: ${decision.pageIdOrRoute}.`,
      );
      continue;
    }
    if (matches.length > 1) {
      errors.push(
        `MEDIA_DECISION_TABLE.md row ${decision.lineNumber} matches multiple Runtime Page Inventory rows: ${decision.pageIdOrRoute}.`,
      );
      continue;
    }

    const [page] = matches;
    const rows = pageResolutionCounts.get(page.pageId) ?? [];
    rows.push(decision);
    pageResolutionCounts.set(page.pageId, rows);
  }

  for (const [pageId, rows] of pageResolutionCounts) {
    if (rows.length > 1) {
      errors.push(
        `Duplicate media decision row for Runtime Page Inventory page "${pageId}": rows ${rows.map((row) => row.lineNumber).join(", ")}.`,
      );
    }
  }

  return errors;
}

function pushSeveritySignal(
  signals: MediaReadinessSignals,
  page: PageInventoryEntry,
  decision: MediaReadinessDecision,
  state: "pending" | "fallback-only",
) {
  const message = `Media readiness ${page.pageId} (${page.route}) is ${decision.mediaNeed} and ${state}; unresolved media is not resolved by Starter projection.`;

  if (decision.mediaNeed === "HIGH PRIORITY") {
    if (page.pageType === "home" || page.route === "/") {
      signals.errors.push(message);
    } else {
      signals.warnings.push(message);
    }
    return;
  }

  signals.info.push(message);
}

function projectNoMediaDecision(
  signals: MediaReadinessSignals,
  decision: MediaReadinessDecision,
) {
  if (
    decision.rightsState === "UNRESOLVED" ||
    decision.humanDecision === "REVISE" ||
    decision.humanDecision === "BLOCK" ||
    decision.visualGateState === "REVISE" ||
    decision.visualGateState === "BLOCK"
  ) {
    signals.errors.push(
      `MEDIA_DECISION_TABLE.md row ${decision.lineNumber} has NO MEDIA NEEDED conflict/revise/block states; unsupported unresolved rights or Human/visual block cannot be hidden by no-media classification.`,
    );
    return;
  }

  if (decision.humanDecision === "PENDING" || decision.visualGateState === "PENDING") {
    signals.warnings.push(
      `MEDIA_DECISION_TABLE.md row ${decision.lineNumber} is pending no-media Human/visual review.`,
    );
    return;
  }

  if (
    hasExplanation(decision.needRationale) &&
    decision.candidateState === "NOT FOUND" &&
    decision.rightsState === "NOT REQUIRED FOR EMBED" &&
    (decision.humanDecision === "APPROVED" || decision.humanDecision === "WAIVED") &&
    decision.integrationState === "NOT INTEGRATED" &&
    decision.visualGateState === "PASS"
  ) {
    return;
  }

  if (!hasExplanation(decision.needRationale)) {
    signals.errors.push(
      `MEDIA_DECISION_TABLE.md row ${decision.lineNumber} has NO MEDIA NEEDED without positive need_rationale.`,
    );
    return;
  }

  signals.errors.push(
    `MEDIA_DECISION_TABLE.md row ${decision.lineNumber} has unsupported media lifecycle combination for NO MEDIA NEEDED.`,
  );
}

function projectMediaNeededDecision(
  signals: MediaReadinessSignals,
  page: PageInventoryEntry,
  decision: MediaReadinessDecision,
) {
  if (
    decision.humanDecision === "REVISE" ||
    decision.humanDecision === "BLOCK" ||
    decision.visualGateState === "REVISE" ||
    decision.visualGateState === "BLOCK"
  ) {
    signals.errors.push(
      `MEDIA_DECISION_TABLE.md row ${decision.lineNumber} has blocking Human/visual state for ${page.pageId}: ${decision.humanDecision}/${decision.visualGateState}.`,
    );
    return;
  }

  if (
    decision.humanDecision === "WAIVED" &&
    decision.visualGateState === "PASS" &&
    hasExplanation(decision.notes || decision.ownerOrDeferReason)
  ) {
    return;
  }

  if (
    decision.candidateState === "SEMANTICALLY VERIFIED" &&
    (decision.rightsState === "VERIFIED" ||
      decision.rightsState === "HUMAN RISK ACCEPTED" ||
      decision.rightsState === "NOT REQUIRED FOR EMBED") &&
    decision.humanDecision === "APPROVED" &&
    decision.integrationState === "INTEGRATED" &&
    decision.visualGateState === "PASS"
  ) {
    return;
  }

  if (decision.humanDecision === "PENDING" || decision.visualGateState === "PENDING") {
    pushSeveritySignal(signals, page, decision, "pending");
    return;
  }

  if (decision.integrationState === "FALLBACK ONLY") {
    pushSeveritySignal(signals, page, decision, "fallback-only");
    return;
  }

  signals.errors.push(
    `MEDIA_DECISION_TABLE.md row ${decision.lineNumber} has unsupported media lifecycle combination for ${page.pageId}.`,
  );
}

export function collectMediaReadinessSignals({
  inventory,
  decisions,
}: MediaReadinessInput): MediaReadinessSignals {
  const signals: MediaReadinessSignals = { errors: [], warnings: [], info: [] };
  if (!decisions) return signals;

  signals.errors.push(...collectInventoryResolutionErrors(inventory, decisions));
  if (signals.errors.length > 0) return signals;

  for (const decision of decisions) {
    const page = resolveInventoryPage(inventory, decision);
    if (!page) continue;

    if (decision.mediaNeed === "NO MEDIA NEEDED") {
      projectNoMediaDecision(signals, decision);
      continue;
    }

    projectMediaNeededDecision(signals, page, decision);
  }

  return signals;
}

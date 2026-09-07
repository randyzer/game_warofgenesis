import type { PageInventoryEntry } from "../data/schemas/page-inventory";

export type MediaReadinessPriority =
  | "HIGH PRIORITY"
  | "RECOMMENDED"
  | "NO MEDIA NEEDED";

export type MediaReadinessStatus = "resolved" | "unresolved";

export interface MediaReadinessDecision {
  pageId?: string;
  route?: string;
  priority: MediaReadinessPriority;
  status: MediaReadinessStatus;
  rationale?: string;
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

const priorityLabels: MediaReadinessPriority[] = [
  "HIGH PRIORITY",
  "RECOMMENDED",
  "NO MEDIA NEEDED",
];
const statusLabels: MediaReadinessStatus[] = ["resolved", "unresolved"];

function normalizeCell(value: string): string {
  return value.replace(/<br\s*\/?>/gi, " ").replace(/\s+/g, " ").trim();
}

function normalizeHeader(value: string): string {
  return normalizeCell(value).toLocaleLowerCase("en").replace(/[^a-z0-9]+/g, "");
}

function parsePriority(value: string): MediaReadinessPriority | undefined {
  const normalized = normalizeCell(value).toLocaleUpperCase("en");
  return priorityLabels.find((label) => label === normalized);
}

function parseStatus(value: string): MediaReadinessStatus | undefined {
  const normalized = normalizeCell(value).toLocaleLowerCase("en");
  return statusLabels.find((label) => label === normalized);
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

export function parseMediaDecisionTableMarkdown(markdown: string): MediaDecisionTableParseResult {
  const errors: string[] = [];
  const decisions: MediaReadinessDecision[] = [];

  if (!markdown.trim()) {
    return {
      decisions,
      errors: ["MEDIA_DECISION_TABLE.md is present but empty."],
    };
  }

  const rows = markdown
    .split(/\r?\n/)
    .map((line, index) => ({ line: line.trim(), lineNumber: index + 1 }))
    .filter(({ line }) => line.startsWith("|") && line.endsWith("|"))
    .map<MarkdownTableRow>(({ line, lineNumber }) => ({
      cells: splitMarkdownRow(line),
      lineNumber,
    }));

  const headerIndex = rows.findIndex((_, index) =>
    rows[index + 1] && isSeparatorRow(rows[index + 1].cells),
  );
  if (headerIndex === -1) {
    return {
      decisions,
      errors: [
        "MEDIA_DECISION_TABLE.md must contain a Markdown table with a header row, separator row, and required columns: Page ID or Route, Priority, Status.",
      ],
    };
  }

  const headers = rows[headerIndex].cells.map(normalizeHeader);
  const hasPageId = headers.includes("pageid");
  const hasRoute = headers.includes("route");
  const hasPriority = headers.includes("priority");
  const hasStatus = headers.includes("status");

  if (!hasPageId && !hasRoute) {
    errors.push("MEDIA_DECISION_TABLE.md requires either a Page ID or Route column.");
  }
  if (!hasPriority) {
    errors.push("MEDIA_DECISION_TABLE.md is missing required column: Priority.");
  }
  if (!hasStatus) {
    errors.push("MEDIA_DECISION_TABLE.md is missing required column: Status.");
  }
  if (errors.length > 0) {
    return { decisions, errors };
  }

  const dataRows = rows
    .slice(headerIndex + 2)
    .filter((row) => !isSeparatorRow(row.cells));

  for (const row of dataRows) {
    if (row.cells.every((cell) => !cell)) {
      continue;
    }

    const byHeader = new Map(headers.map((header, index) => [header, row.cells[index] ?? ""]));
    const pageId = byHeader.get("pageid") || undefined;
    const route = byHeader.get("route") || undefined;
    const priorityValue = byHeader.get("priority") ?? "";
    const statusValue = byHeader.get("status") ?? "";
    const priority = parsePriority(priorityValue);
    const status = parseStatus(statusValue);
    const rowErrors: string[] = [];

    if (!pageId && !route) {
      rowErrors.push(`MEDIA_DECISION_TABLE.md row ${row.lineNumber} requires Page ID or Route.`);
    }
    if (!priority) {
      rowErrors.push(`MEDIA_DECISION_TABLE.md row ${row.lineNumber} has unsupported Priority "${priorityValue || "(blank)"}". Supported values: ${listValues(priorityLabels)}.`);
    }
    if (!status) {
      rowErrors.push(`MEDIA_DECISION_TABLE.md row ${row.lineNumber} has unsupported Status "${statusValue || "(blank)"}". Supported values: ${listValues(statusLabels)}.`);
    }

    if (rowErrors.length > 0) {
      errors.push(...rowErrors);
      continue;
    }
    if (!priority || !status) {
      continue;
    }

    const rationale = byHeader.get("rationale") || undefined;
    decisions.push({
      ...(pageId ? { pageId } : {}),
      ...(route ? { route } : {}),
      priority,
      status,
      ...(rationale ? { rationale } : {}),
    });
  }

  if (decisions.length === 0 && errors.length === 0) {
    errors.push("MEDIA_DECISION_TABLE.md must contain at least one non-empty data row.");
  }

  return { decisions, errors };
}

export function collectMediaReadinessSignals({
  inventory,
  decisions,
}: MediaReadinessInput): MediaReadinessSignals {
  const signals: MediaReadinessSignals = { errors: [], warnings: [], info: [] };
  if (!decisions) return signals;

  const pageById = new Map(inventory.map((page) => [page.pageId, page]));
  const pageByRoute = new Map(inventory.map((page) => [page.route, page]));

  for (const decision of decisions) {
    const page = decision.pageId
      ? pageById.get(decision.pageId)
      : decision.route
        ? pageByRoute.get(decision.route)
        : undefined;
    const label = decision.pageId ?? decision.route ?? "(missing page reference)";

    if (!page) {
      signals.errors.push(`Media readiness references unknown page: ${label}.`);
      continue;
    }

    if (decision.priority === "NO MEDIA NEEDED") {
      continue;
    }
    if (decision.status === "resolved") {
      continue;
    }

    if (decision.priority === "HIGH PRIORITY") {
      const message = `Media readiness ${page.pageId} (${page.route}) is HIGH PRIORITY but unresolved.`;
      if (page.pageType === "home" || page.route === "/") {
        signals.errors.push(message);
      } else {
        signals.warnings.push(message);
      }
      continue;
    }

    signals.info.push(
      `Media readiness ${page.pageId} (${page.route}) is RECOMMENDED but unresolved.`,
    );
  }

  return signals;
}

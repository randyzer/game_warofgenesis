export interface EntityDatabaseRow {
  id: string;
  name: string;
  summary: string;
  classification: string;
  detail: string;
  patch: string;
  route?: string;
}

export interface EntityFilterOptions {
  query: string;
  classification: string;
  sortBy?: "name" | "classification" | "patch";
  direction?: "asc" | "desc";
}

export function getEntityClassifications(
  rows: EntityDatabaseRow[],
): string[] {
  return [...new Set(rows.map((row) => row.classification))].sort((left, right) =>
    left.localeCompare(right, "en"),
  );
}

export function filterEntityRows(
  rows: EntityDatabaseRow[],
  options: EntityFilterOptions,
): EntityDatabaseRow[] {
  const query = options.query.trim().toLocaleLowerCase("en");
  const filtered = rows.filter((row) => {
    const matchesClassification =
      options.classification === "all" ||
      row.classification === options.classification;
    const searchable = [
      row.name,
      row.summary,
      row.classification,
      row.detail,
      row.patch,
    ]
      .join(" ")
      .toLocaleLowerCase("en");

    return matchesClassification && (!query || searchable.includes(query));
  });

  if (!options.sortBy) return filtered;

  const direction = options.direction === "desc" ? -1 : 1;
  return filtered
    .map((row, index) => ({ row, index }))
    .sort((left, right) => {
      const comparison = left.row[options.sortBy!].localeCompare(
        right.row[options.sortBy!],
        "en",
        { numeric: true },
      );
      return comparison === 0
        ? left.index - right.index
        : comparison * direction;
    })
    .map(({ row }) => row);
}

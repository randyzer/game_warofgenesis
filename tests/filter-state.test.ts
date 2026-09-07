import { describe, expect, it } from "vitest";

import {
  filterEntityRows,
  getEntityClassifications,
  type EntityDatabaseRow,
} from "../src/core/filter-state";

const rows: EntityDatabaseRow[] = [
  {
    id: "alpha",
    name: "Alpha Guard",
    summary: "Controls a narrow objective with steady defensive pressure.",
    classification: "Tank",
    detail: "Difficulty 2/5",
    patch: "1.2",
    route: "/heroes/alpha/",
  },
  {
    id: "bravo",
    name: "Bravo Scout",
    summary: "Finds distant threats and opens safe rotations for the team.",
    classification: "Support",
    detail: "Difficulty 3/5",
    patch: "1.1",
  },
  {
    id: "charlie",
    name: "Charlie Guard",
    summary: "Protects teammates while holding the center of the arena.",
    classification: "Tank",
    detail: "Difficulty 1/5",
    patch: "1.2",
  },
];

describe("entity filter state", () => {
  it("filters case-insensitively across visible row fields", () => {
    expect(
      filterEntityRows(rows, { query: "DISTANT", classification: "all" }).map(
        (row) => row.id,
      ),
    ).toEqual(["bravo"]);
  });

  it("filters by classification and exposes stable options", () => {
    expect(getEntityClassifications(rows)).toEqual(["Support", "Tank"]);
    expect(
      filterEntityRows(rows, { query: "", classification: "Tank" }).map(
        (row) => row.id,
      ),
    ).toEqual(["alpha", "charlie"]);
  });

  it("sorts without mutating the source rows", () => {
    const sorted = filterEntityRows(rows, {
      query: "",
      classification: "all",
      sortBy: "patch",
      direction: "desc",
    });

    expect(sorted.map((row) => row.id)).toEqual(["alpha", "charlie", "bravo"]);
    expect(rows.map((row) => row.id)).toEqual(["alpha", "bravo", "charlie"]);
  });
});

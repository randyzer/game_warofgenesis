import { useMemo, useState } from "react";

import {
  filterEntityRows,
  getEntityClassifications,
  type EntityDatabaseRow,
} from "../../core/filter-state";

interface Props {
  rows: EntityDatabaseRow[];
  entityLabel: string;
}

export default function EntityFilterIsland({ rows, entityLabel }: Props) {
  const [query, setQuery] = useState("");
  const [classification, setClassification] = useState("all");
  const [sort, setSort] = useState("name:asc");
  const classifications = useMemo(() => getEntityClassifications(rows), [rows]);
  const [sortBy, direction] = sort.split(":") as [
    "name" | "classification" | "patch",
    "asc" | "desc",
  ];
  const visibleRows = useMemo(
    () =>
      filterEntityRows(rows, {
        query,
        classification,
        sortBy,
        direction,
      }),
    [classification, direction, query, rows, sortBy],
  );

  return (
    <div className="entity-filter">
      <div className="entity-filter__controls">
        <label>
          <span>Filter {entityLabel}</span>
          <input
            type="search"
            value={query}
            placeholder="Name, detail, patch…"
            onChange={(event) => setQuery(event.currentTarget.value)}
          />
        </label>
        <label>
          <span>Classification</span>
          <select
            value={classification}
            onChange={(event) => setClassification(event.currentTarget.value)}
          >
            <option value="all">All classifications</option>
            {classifications.map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Sort records</span>
          <select value={sort} onChange={(event) => setSort(event.currentTarget.value)}>
            <option value="name:asc">Name / A–Z</option>
            <option value="name:desc">Name / Z–A</option>
            <option value="classification:asc">Classification</option>
            <option value="patch:desc">Patch / newest</option>
          </select>
        </label>
      </div>

      <p className="entity-filter__count" aria-live="polite">
        Showing {visibleRows.length} of {rows.length} records.
      </p>

      <div className="table-scroll" role="region" aria-label={`${entityLabel} database`} tabIndex={0}>
        <table>
          <caption>{entityLabel} records verified for the current fact dataset</caption>
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Classification</th>
              <th scope="col">Key detail</th>
              <th scope="col">Patch</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row) => (
              <tr key={row.id}>
                <th scope="row">
                  {row.route ? <a href={row.route}>{row.name}</a> : row.name}
                  <small>{row.summary}</small>
                </th>
                <td>{row.classification}</td>
                <td>{row.detail}</td>
                <td>{row.patch}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

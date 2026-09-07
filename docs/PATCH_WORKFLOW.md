# Patch Workflow

1. Record the game patch/version and obtain primary supporting sources.
2. Identify changed entities and run an impact query for each one:

   ```bash
   npm run patch:impact -- --entity-type hero --entity-id example-hero
   ```

3. Review every printed Page Inventory ID, including unpublished/disabled pages
   that may depend on the same entity.
4. Update the entity's single fact record, source access date, evidence note,
   confidence, patch, and `updatedAt`.
5. Update affected prose or tool definitions only where interpretation or
   formulas changed.
6. Set/clear `needsUpdate` and `needsReview` manually after editorial review.
   The impact command never edits workflow fields or publication dates.
7. Run `npm run check`, `npm run build`, and the browser checks in
   `docs/QA_CHECKLIST.md`.

Valid entity types are `hero`, `weapon`, `item`, and `map`. IDs use lowercase
kebab-case and must match the fact and Inventory references exactly.

# Tool definitions

Add one validated JSON file per enabled tool route using the route slug as the
filename, for example `damage-calculator.json`. Calculator definitions use the
safe operation-tree schema in `src/data/schemas/tools.ts`; planner definitions
declare explicit slots and options. Attach sources, patch, update date, and
confidence to every definition. Keep calculator/planner feature flags disabled
until the matching Page Inventory row and definition file are both reviewed.

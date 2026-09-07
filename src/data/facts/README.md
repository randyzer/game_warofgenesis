# Fact data contract

This directory is intentionally empty in the starter because every entity module is disabled by default.

When a module is enabled in `game.config.ts`, add the matching JSON file:

- `heroes.json`
- `weapons.json`
- `items.json`
- `maps.json`

Each file contains one JSON array and must pass its dedicated schema in `src/data/schemas/facts.ts`. IDs and slugs must be unique within the file. Every factual record needs at least one HTTPS source, an accessed date, an evidence note, and an explicit confidence level.

Do not create empty files for disabled modules. The build validator deliberately skips disabled modules and fails when an enabled module has no matching fact file. The starter ships no fictional production game facts; test fixtures live only in `tests/`.

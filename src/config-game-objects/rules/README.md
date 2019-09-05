# Game rules

Optionally configurable rules used to modify in-game mechanics and (over time) whatever else we decide should be configurable.

One rule set per file in `defs`.

## Rules

* `defs` folder:
    * flat (no subfolders)
    * all files ending in `.json` are treated as type definitions and will potentially be loaded (and subject to validation)
    * filename must match the `name` field (human friendly housekeeping rule imposed by code)

# Terrain definitions

Defines unique types of terrain that could potentially appear at some coordinate on a map.

One terrain type per file in `defs`.

## Rules

* `defs` folder:
    * flat (no subfolders)
    * all files ending in `.json` are treated as type definitions and will potentially be loaded (and subject to validation)
    * filename must match the `name` field (human friendly housekeeping rule imposed by code)

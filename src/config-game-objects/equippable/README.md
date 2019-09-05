# Equippable items

Items that can be carried by units, usually special units like `hero` types. Items should provide a net positive bonus of some kind for the player + unit using them.

One item per file in `defs`.

## Rules

* `defs` folder:
    * flat (no subfolders)
    * all files ending in `.json` are treated as type definitions and will potentially be loaded (and subject to validation)
    * filename must match the `name` field (human friendly housekeeping rule imposed by code)

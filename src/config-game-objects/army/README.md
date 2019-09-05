# Armies

Define the different types of armies potentially available in the game. The restrictions of what `army` is actually available in a game is defined in the game rules.

One army per file in `defs`.

## Rules

* `defs` folder:
    * flat (no subfolders)
    * all files ending in `.json` are treated as type definitions and will potentially be loaded (and subject to validation)
    * filename must match the `name` field (human friendly housekeeping rule imposed by code)

# Empires

The in-game persona of the player. Defines the faction and leader (often one and the same) of the player as well as advantages and disadvantages applied to the troops, economics, etc.

One empire per file in `defs`.

## Rules

* `defs` folder:
    * flat (no subfolders)
    * all files ending in `.json` are treated as type definitions and will potentially be loaded (and subject to validation)
    * filename must match the `name` field (human friendly housekeeping rule imposed by code)

# Effects

Game modifiers, often dice roll modifiers, that can be added to `army` or `equippable` or really any other game object that supports `effects`.

One effect per file in `defs`.

## Rules

* `defs` folder:
    * flat (no subfolders)
    * all files ending in `.json` are treated as type definitions and will potentially be loaded (and subject to validation)
    * filename must match the `name` field (human friendly housekeeping rule imposed by code)

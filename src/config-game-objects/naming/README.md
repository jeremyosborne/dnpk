# Character naming lists

Lists of strings used to name characters. The lists should be grouped in a some meaningful way, for example grouping all hero names together.

One group of names per files in `defs`.

## Rules

* `defs` folder:
    * flat (no subfolders)
    * all files ending in `.json` are treated as type definitions and will potentially be loaded (and subject to validation)
    * filename must match the `name` field (human friendly housekeeping rule imposed by code)

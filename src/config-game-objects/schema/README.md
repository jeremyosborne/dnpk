# Game object model definition via JSON-Schema

Define the structure, relationships, and validations for user configurable game objects.

Schemas are not intended to be user writeable but should be made available, and readable, to users who wish to validate their own configuration modifications.

Together all the schemas define the configurable model, and due to the way we load and manage schemas in the game, we keep all of the schemas together here.

## Rules

* `defs` folder:
    * flat (no subfolders)
    * all files ending in `.schema.json` are treated as schema definitions and will be loaded
    * filename must match the distinct portion fo the `$id` (human friendly housekeeping rule imposed by code)

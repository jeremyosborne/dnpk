# Game object model definition via JSON-Schema

Define the structure, relationships, and validations for user configurable game objects.

Schemas are not intended to be user writeable but should be made available, and readable, to users who wish to validate their own configuration modifications.

Schemas are, unfortunately from the way I've seen from my usage, a bit monolithic (due to the way I'm building relationships via references) and so are grouped all together vs. taking the more modular, plug-and-play approac the rest of the app attempts to make.

## Rules

* `defs` folder:
    * flat (no subfolders)
    * all files ending in `.schema.json` are treated as schema definiitions and will be loaded
    * filename should match the distinct portion fo the `$id`

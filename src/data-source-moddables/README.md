# Modifiable game data

We want the game to be configurable and modifiable, and to do that we provide a set of configuration files and patterns to allow the user to tweak basics about the game without needing to modify the source code.

This module provides the interchange between files on some disk and the game.

## Dev Notes

* Module (and members) are a singleton within the app space, due to internal state.
* Most moddable types are created in `index.js`. See the `types` object.
* The schemas are not meant to be modified, but are provided to users so that they can validate their own schemas, and as such live with the moddables in the code base.
    * Code or organization changes that affect the regular types should be confirmed to work with the `schema` module that duplicates code found in `type-factory-factory`.
* Module requires an async `.read()` call before the module is used.

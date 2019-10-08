# Configuration for in game objects

We want the game to be configurable and modifiable, and to do that we provide a set of configuration files and patterns to allow the user to tweak basics about the game without needing to modify the source code.

This module provides the interchange between files on some disk and the game.

## Dev Notes

* Module (and members) are a singleton within the app space, due to internal state.
* Module requires an async `.read()` call before the module is used.

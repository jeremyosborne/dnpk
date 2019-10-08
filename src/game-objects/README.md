# Game objects

Wrappers, functions, probably even the occasionally `class` (wow!) for working with the raw game object data. They are only backed by `data-source-game-objects` for times when we want to make variations of the game objects user/modder configurable.

The application should make use of `game-objects` and not directly make use of `data-source-game-objects`.

## Dev Notes

* Frontend for `data-source-game-objects`.
* Modules and submodules do not keep internal state.

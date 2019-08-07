# Dark nights of the plague king

A wargame inspired by the original [Warlords game by SSG](https://en.wikipedia.org/wiki/Warlords_(1990_video_game)) and what I always wanted to see as available in a modern version of that game.

## Software Decisions

* Language: JavaScript
* [JSON Schema](https://json-schema.org) for raw data type definitions.
* [JSON](http://json.org/) as a data interchange / data storage format.
* Use of `NODE_PATH=src` to allow local imports within the application codebase. Tests, build tools, etc. will need to be configured to handle this.
* Module scoped logging via [debug](https://github.com/visionmedia/debug).
    * Namespace of all `debug` module name labels must be prefixed with `dnpk/`.

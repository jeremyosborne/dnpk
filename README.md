# Dark nights of the plague king

A wargame inspired by the original [Warlords game by SSG](https://en.wikipedia.org/wiki/Warlords_(1990_video_game)) and what I always wanted to see as available in a modern version of that game.

## Software Decisions

* Language: JavaScript
* [JSON Schema](https://json-schema.org) for raw data type definitions.
    * To prevent the code from needing to know the difference in the core name of a type, types names will always take the singular form of their noun: "army" not "armies"; "item" not "items".
* [JSON](http://json.org/) as a data interchange / data storage format.
* Use of `NODE_PATH=src` to allow local imports within the application codebase. Tests, build tools, etc. will need to be configured to handle this.
* Module scoped logging via [debug](https://github.com/visionmedia/debug).
    * Namespace of all `debug` module name labels must be prefixed with `dnpk/`.
* Game simulation should be runnable without graphics.
* Localization is applied at view layer. English strings act as keys for localization, with optional translation of long English content via key.
    * Potential no. 1:
        * [i18next](https://www.i18next.com/) and tooling is our trial localization library.
        * [i18next-parser](https://github.com/i18next/i18next-parser) is used to extract translations.
            * PROBLEM: output is still in JSON format, so still needs to be converted to `.pot?` format.
            * PROBLEM: output loses context from where the key string came from.

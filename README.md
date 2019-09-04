# Dark nights of the plague king

A wargame inspired by the original [Warlords game by SSG](https://en.wikipedia.org/wiki/Warlords_(1990_video_game)) and what I always wanted to see as available in a modern version of that game.

## Guiding Principles

* Code
    * blocks and modules should [do one thing well](https://en.wikipedia.org/wiki/Unix_philosophy).
    * should be testable.
    * will be refactored, it's just a question of when.
* Graphics
    * Core game mechanics should be usable without graphics.
* Importing and module structure
    * Intermodule, prefer: `import * as l10n from 'l10n'` vs. `import * as l10n from '../../l10n'`
    * Intramodule, prefer: `import * as './submodule'`
* Languages
    * JavaScript transpiled with [babel](https://babeljs.io/).
        * Developer mode: assume usage of `babel-node`.
    * [JSON](http://json.org/) as a data interchange / data storage format.
    * [JSON Schema](https://json-schema.org) for validating data type definitions.
        * To prevent the code from needing to know the difference in the core name of a type, types names will always take the singular form of their noun: "army" not "armies"; "item" not "items".
* Localization
    * see `src/l10n` module for docs.
* Logging
    * via [debug](https://github.com/visionmedia/debug)
    * Modular scoping.
    * Namespace of all `debug` module name labels must be prefixed with `dnpk/`.
* Semantics
    * Names and naming conventions are of first class importance.
    * Singular objects and type definitions should have singular names: `army` not `armies`.
    * Plural forms indicate groups of objects: arrays, sets, queues, lists, bags, etc.
    * Attribute value calculations assume some relative `effective` value being computed and returned as a result. A `base` prefix should be used to find attribute values on entities that are not modified within expected context.
        * Example: `army.strength(someArmy)` would return the value of that army's effective strength with all relative things considered, where as `army.strengthBase(someArmy)` would return the base, unmodified value of that unit.

## Configuration options

[Configuration is assumed to be passed from the environment.](https://12factor.net/config)

* Set `DEBUG=[some glob expression]` to manage which [debug](https://www.npmjs.com/package/debug) messages are shown.
* All application modules should namespace their debugging with `dnpk/` to aid with ignoring third party module messages. `DEBUG=dnpk/*` should capture just the messages reported from this application.
* `NODE_PATH=src` must be applied to the environment of all executables (app, tests, etc.) using this application or modules within this application to allow a "local module" style of importing vs. the horrendously brittle `../../../` relative path reference to other modules.

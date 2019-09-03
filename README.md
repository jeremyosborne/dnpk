# Dark nights of the plague king

A wargame inspired by the original [Warlords game by SSG](https://en.wikipedia.org/wiki/Warlords_(1990_video_game)) and what I always wanted to see as available in a modern version of that game.

## Guiding Principles

* Code blocks and modules should [do one thing well](https://en.wikipedia.org/wiki/Unix_philosophy).
* Code should be testable.
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
* Game simulation should be runnable without graphics.
* Semantics
    * Singular objects and type defs are singular: `army` vs `armies`.
    * Plural forms indicate an Array, or some other group or set type.
    * Data access assumes `effective` value taken at this moment with all relative things considered. A `base` prefix should be used to find attribute values on entities that are not modified within expected context.s

## Configuration options

[Configuration is assumed to be passed from the environment.](https://12factor.net/config)

* Set `DEBUG=[some glob expression]` to manage which [debug](https://www.npmjs.com/package/debug) messages are shown.
* All application modules should namespace their debugging with `dnpk/` to aid with ignoring third party module messages. `DEBUG=dnpk/*` should capture just the messages reported from this application.
* `NODE_PATH=src` must be applied to the environment of all executables (app, tests, etc.) using this application or modules within this application to allow a "local module" style of importing vs. the horrendously brittle `../../../` relative path reference to other modules.

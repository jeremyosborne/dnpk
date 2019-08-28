# Dark nights of the plague king

A wargame inspired by the original [Warlords game by SSG](https://en.wikipedia.org/wiki/Warlords_(1990_video_game)) and what I always wanted to see as available in a modern version of that game.

## Software organization

* Language: JavaScript
* [JSON Schema](https://json-schema.org) for raw data type definitions.
    * To prevent the code from needing to know the difference in the core name of a type, types names will always take the singular form of their noun: "army" not "armies"; "item" not "items".
* [JSON](http://json.org/) as a data interchange / data storage format.
* Localization is covered in the `src/l10n` module.
* Use of `NODE_PATH=src` to allow local imports within the application codebase. Tests, build tools, etc. will need to be configured to handle this.
    * Example: `require('l10n')` vs. `require('../../l10n')`.
* Module scoped logging via [debug](https://github.com/visionmedia/debug).
    * Namespace of all `debug` module name labels must be prefixed with `dnpk/`.
* Game simulation should be runnable without graphics.

## Configuration options

[Configuration is assumed to be passed from the environment.](https://12factor.net/config)

* Set `DEBUG=[some glob expression]` to manage which [debug](https://www.npmjs.com/package/debug) messages are shown.
* All application modules should namespace their debugging with `dnpk/` to aid with ignoring third party module messages. `DEBUG=dnpk/*` should capture just the messages reported from this application.
* Requirement: `NODE_PATH=src`, or equivalent, must be applied to the environment of all executables (app, tests, etc) using this application or modules within this application.

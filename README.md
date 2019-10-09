# Dark nights of the plague king

A wargame inspired by the original [Warlords game by SSG](https://en.wikipedia.org/wiki/Warlords_(1990_video_game)) and what I always wanted to see as available in a modern version of that game.

## Guiding Principles

* Code
    * blocks and modules should [do one thing well](https://en.wikipedia.org/wiki/Unix_philosophy).
    * should be testable.
        * First round of testing is unit-like, aiming for 100% line coverage.
        * Each file should have a test file associated with it. Helps to visualize what is covered and what is not.
    * will be refactored, it's just a question of when.
    * should support and conform to interfaces, intentionally designed ones and those that arise.
    * should opt for labeled arguments via object as first arg, with labeled dependency injection and configuration via object as second argument.
        * By always unpacking arguments, DI and configuration defaults can be protected.
* Documentation
    * Design and conversation documentation goes in `docs`.
    * Use [esdoc](https://esdoc.org/) style to document functions.
        * Output lives in `docs/src` and is `.gitignore`d.
    * As the code matures, and where it makes sense, move stable types to [flow](https://flow.org/) types and interfaces and document the types, decreasing the amount of detailed oriented `esdoc` style documentation a function or type needs.
* Events
    * `type='event'` field required to be consistent with other duck typing.
    * `name` field of event is assumed to be tokenized (vs. having arbitrary `subName` style of object naming hierarchies).
        * Split naming hierarchy by `:` character.
        * Event naming hierarchy is most to least significant after splitting (reverse dns).
    * The remaining fields on the event object are not reserved and are to be implemented as needed to describe significant information.
* Graphics
    * Core game mechanics should be usable without graphics.
* Importing and module structure
    * Prefer named exports and `import * as blah from 'blah'` vs. default exports.
        * Exception: when adhering to a one function / object per file structure, be kind and export the one object as default, too.
        * Exception: React Components should export their augmented component (e.g. redux connected) as default, and their unconnected component as a named export.
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
* Runtime configuration
    * see `config-runtime` for docs.
* Semantics
    * Names and naming conventions are important. Be nice to your fellow human looking at this code.
    * Singular objects and type definitions should have singular names: `army` not `armies`.
    * Groups of objects should have plural names: arrays, sets, queues, lists, bags, etc.: `armies` not `army`.
    * Attribute value calculations assume some relative `effective` value being computed and returned as a result. A `base` prefix should be used to find attribute values on entities that are not modified within expected context.
        * Example: `army.strength(someArmy)` would return the value of that army's effective strength with all relative things considered, where as `army.strengthBase(someArmy)` would return the base, unmodified value of that unit (assuming a function call like that should ever be necessary to make due to obscure property access).
    * Naming conventions in use:
        * `clear` -> synchronous function to remove cached data from application memory.
        * `get` -> synchronous function to retrieve keyed data from application memory, similar to `_.get`.
        * `read` -> asynchronous function that retrieves data from a source outside of the application and, on success, stores the read data in memory.
        * `remove` -> asynchronous function that, where appropriate, requests that externally stored data be removed and, on success, is a confirmation the data has been deleted.
        * `set` -> synchronous function to modify keyed data in application memory, similar to `_.set`.
        * `save` -> asynchronous function that combines a `set` and a `write` to an external data source.
        * `write` -> asynchronous function that pushes data from the application to a source outside of the application and, on success, is assumed to have successfully stored the data elsewhere.

## Runtime configuration options

[Configuration is assumed to be passed from the environment.](https://12factor.net/config)

Modules the make use of runtime configuration settings should list those within their module docs under the `## Runtime configuration options` heading.

### Configuration options that are not module specific

* Set `DEBUG=dnpk/*` to show all logging messages specific to this application.
* `NODE_PATH=src` must be applied to the environment of all executables (app, tests, etc.) using this application or modules within this application to allow a "local module" style of importing vs. the horrendously brittle `../../../` relative path reference to other modules.

## TODO

- [ ] Find a JavaScript lib like numpy/scipy.

## Ideas

- [ ] Positive and negative morale for winning / losing battles. Morale is contagious to nearby army groups.
- [ ] Rules where instead of losing a battle fully, one group can route.
- [ ] Prisoners.
- [ ] Terrain modifications beyond cities and towers, like traps and fires.
- [ ] Injuries for fighting in a battle.
- [ ] Experience for a fighting group.
- [ ] In that very far future where there might be a modder, include how to import additional translations for modded data.
- [ ] Experiment with [blessed](https://github.com/chjj/blessed) for terminal GUIs.

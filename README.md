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

## Runtime configuration options

[Configuration is assumed to be passed from the environment.](https://12factor.net/config)

Modules the make use of runtime configuration settings should list those within their module docs under the `## Runtime configuration options` heading.

### Configuration options that are not module specific

* Set `DEBUG=dnpk/*` to show all logging messages specific to this application.
* `NODE_PATH=src` must be applied to the environment of all executables (app, tests, etc.) using this application or modules within this application to allow a "local module" style of importing vs. the horrendously brittle `../../../` relative path reference to other modules.

## TODO

- [ ] Add terrain for battle, including terrain bonuses to total army group bonus.
- [ ] Play around with more formal player object structuring, which seems like is just the glue of the empire plus army groups plus economic state.

## Ideas

- [ ] Positive and negative morale for winning / losing battles. Morale is contagious to nearby army groups.
- [ ] Rules where instead of losing a battle fully, one group can route.
- [ ] Prisoners.
- [ ] Terrain modifications beyond cities and towers, like traps and fires.
- [ ] Injuries for fighting in a battle.
- [ ] Experience for a fighting group.

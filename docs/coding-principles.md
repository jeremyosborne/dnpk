# Coding principles

If you're in the code base, or modifying data-as-code, please adhere to these values and rules. The spirit of the value implied by the rule should always win out over a draconian adherence to the letter of the rule.

## Code

* Code groupings should [do one thing well](https://en.wikipedia.org/wiki/Unix_philosophy).
* We like the values preached by [The Twelve-Factor App](https://12factor.net/config).
* Code should be testable.
    * First round of testing is unit-like, aiming for 100% line coverage.
    * Each file should have a test file associated with it. Helps to visualize what is covered and what is not.
* Code will be refactored, it's just a question of when.
* Code should support and conform to interfaces, ones intentionally designed from the outset and ones that arise organically.
* Code should opt for labeled arguments via object as first arg, with labeled dependency injection and configuration via object as second argument.
    * By always unpacking arguments, DI and configuration defaults can be protected.
    * The exception to this rule is where using labeled arguments via object would violate the rule of `do one thing well`.

## Documentation

* The `docs` folder is for:
    * Design documentation
    * Thematic prose, background stories
* Use [esdoc](https://esdoc.org/) style to document functions.
    * Output lives in `docs/src` and is `.gitignore`d.
* As the code matures, and where it makes sense, move stable types to [flow](https://flow.org/) types and interfaces and document the types, decreasing the amount of detailed oriented `esdoc` style documentation a function or type needs.
* Entities and Game Objects
* Entities are virtual people, places, and things that together create the system of the game world.
* Entities should always be instantiable, and should always be instantiated (no singletons).
* Entities should implement an `.id` property that is unique within the context of a single game.
    * While some methods allow for data mutation, due to the fact that many methods will make defensive copies and not mutate data, the `.id` property allows for us to make quick checks via a string comparison and assert identity by `objRef1.id === objRef2.id`.
* Due to history, `armies` is a native array of `army` types, and `armyGroup` now stands for a formal `army-group` type.

## Events

* `type="event"` field required to be consistent with other duck typing.
* `name` field of event is assumed to be tokenized (vs. having arbitrary `subName` style of object naming hierarchies).
    * Split naming hierarchy by `:` character.
    * Event naming hierarchy is most to least significant after splitting (reverse dns).
* The remaining fields on the event object are not reserved and are to be implemented as needed to describe significant information.

## Graphics

* Core game mechanics should be usable without graphics.

## Importing and module structure

* Prefer named exports and `import * as blah from 'blah'` vs. default exports.
    * Exception: when adhering to a one function / object per file structure, be kind and export the one object as default, too.
    * Exception: React Components should export their augmented component (e.g. redux connected) as default, and their unconnected component as a named export.
* Intermodule, prefer: `import * as l10n from 'l10n'` vs. `import * as l10n from '../../l10n'`
* Intramodule, prefer: `import * as './submodule'`

## Languages (the source code kind)

* JavaScript transpiled with [babel](https://babeljs.io/).
    * Developer mode: assume usage of `babel-node`.
* [JSON](http://json.org/) as a data interchange / data storage format.
* [JSON Schema](https://json-schema.org) for validating data type definitions.
    * To prevent the code from needing to know the difference in the core name of a type, types names will always take the singular form of their noun: "army" not "armies"; "item" not "items".

## Localization (aka. not everyone speaks english)

* see `src/l10n` module for docs.

## Logging

* via [debug](https://github.com/visionmedia/debug)
* Modular scoping.
* Namespace of all `debug` module name labels must be prefixed with `dnpk/`.

## Runtime configuration

* see `config-runtime` for docs.

## Semantics

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

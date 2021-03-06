# Configuration

Provides environment agnostic access to build time and run time configuration.

## Dev Notes

* Module (and members) are a singleton within the app space, due to internal state.
* Configuration keys are `SCREAMING_SNAKE_CASE`.
* Any set configuration value is assumed to be returned as `string` and must be type cast by the caller.
    * This is to cut down on cute code interpreting value passing from a shell.
    * Keys acting as flags should pass in 1 when set and not be passed when unset.
* Prefers the rarer and more likely intentionally set `globalThis.DNPK_RUNTIME_CONFIGURATION`.
* Secondarily prefers `process.env`, although this is the preferred method for passing in runtime vars and should be used in most cases.

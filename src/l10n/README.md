### Localization

* In most circumstances, English should act as both key and default value for the English language (English key is fallback for English value).
    * English can optionally always be keyed, e.g. for really long content like in game help text.
* The `t()` function is reserved for translation strings, and is easier to write than `i18next.t`, although that works, too.
* Dependencies:
    * [i18next](https://www.i18next.com/) localization library.
    * [i18next-parser](https://github.com/i18next/i18next-parser) extracts translations.
        * PROBLEM: output loses context from where the key string came from. This can probably be solved.
    * [i18next-conv](https://github.com/i18next/i18next-gettext-converter) converts from `.json` to `.po[t]` and `.po` back to `.json`.
* Process:
    * `npm run i18n-extract`
    * `i18next-parser` is used to pull strings out of source code and updates the `.json` string files.
    * `i18next-conv` converts the `l10n/**/translation.json` files to `l10n/**/translation.po` files.
    * TODO: when translation begin, see what works better for management: `.po` files or has the world grown to accept `.json` files?

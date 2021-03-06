import chalk from "chalk"
import * as dataSourceConfig from "data-source-config"
import * as dataSourceL10n from "data-source-l10n"
import i18next from "i18next"
import _ from "lodash"

// By default, what key to inspect on the runtime config
// dictionary for whether or not we'll run the underlying i18next in debug mode
const I18NEXT_DEBUG_KEY = "I18NEXT_DEBUG"

// Default formatters for i18next, see: https://www.i18next.com/translation-function/formatting
// key is the formatter name token
export const _formatters = {
  // callable: {{blah, colorize}}
  // if typeof blah === string, just print
  // if typeof blah.color === string, print via chalk.hex(blah.color)(blah.label)
  colorize: (value) => {
    const color = _.get(value, "color")
    const label = _.get(value, "label")
    if (color) {
      return chalk.hex(color)(label)
    } else {
      // assume string
      return value
    }
  },

  // callable: {{Array<string>, simpleList}}
  // takes a list of strings and joins them, based on language.
  // In English, I'd always write the dynamic elements of the array into a simple, comma delimited list,
  // without trailing `and` conjunction.
  simpleList: (value) => {
    // TODO: switch on language
    return _.join(value, ", ")
  },

  // callable: {{Array<string>, simpleList}}
  // takes a list of strings and joins them, based on language.
  // In English, this would potentially be a list of already comma delimited lists, like a list of
  // long names for a handful of heroes.
  complexList: (value) => {
    // TODO: switch on language
    return _.join(value, "; ")
  },
}

/**
 * Call this on app start up to populate the cache with the necessary
 * translation strings.
 *
 * @param {object} args as dictionary
 * @param {string} [args.lng='en'] default language and language resources to use
 * @param {string|string[]} [args.ns='translation'] default namespace
 * @param {...object} [args.restConfig] any additional key/value pair overrides
 * that will be passed directly to `i18next.read()`.
 *
 * @param {object} config as dictionary of DI utilities (makes testing easier).
 * @param {function} [config.isDebug] function used to determine if we're in
 * debug mode or not, if not explicitly overridden with `args.debug`.
 * @param {function} [config.read] wrapper method for `i18next.read`.
 *
 * @return {Promise}
 */
export const read = async (
  {
    lng = "en",
    ns = [
      "translation",
      "army",
      "battle",
      "deity",
      "empire",
      "equippable",
      "meat-grinder",
    ],
    ...restConfig
  } = {},
  {
    formatters = _formatters,
    isDebug = () => dataSourceConfig.get(I18NEXT_DEBUG_KEY),
    read = (...args) => i18next.init(...args),
  } = {}
) => {
  // Easier to treat as array throughout.
  ns = Array.isArray(ns) ? ns : [ns]
  // Assume we should always be able to read the files....
  await Promise.all(_.map(ns, (ns) => dataSourceL10n.read({ lng, ns })))
  const resources = _.reduce(
    ns,
    (r, n) => {
      _.set(r, `${lng}.${n}`, dataSourceL10n.get({ lng, ns: n }))
      return r
    },
    {}
  )

  await read({
    // default namespace to use.
    defaultNS: ns[0],

    // Explicitly set language to use.
    lng,
    // do not load a fallback, because it'll be english by default.
    fallbackLng: false,

    // string or array of namespaces to load
    ns,
    fallbackNS: ns,

    interpolation: {
      format: function (value, format, lng) {
        if (typeof formatters[format] === "function") {
          return formatters[format](value, format, lng)
        } else {
          return value
        }
      },
    },

    // Treat default token characters of `:` and `.` as normal characters.
    // Equates to: write phrases in english, fallback to english.
    keySeparator: false,
    nsSeparator: false,

    // resources to initialize with (if not using loading or not appending using addResourceBundle)
    resources,

    // allow an empty value to count as invalid (by default is true).
    returnEmptyString: false,

    // true report "missing values", false do not report missing values.
    debug: isDebug(),

    // Explicitly override anything else set.
    ...restConfig,
  })
}

/**
 * Import and as _the_ translation function, since _() has a legacy in JavaScript
 * as somthing other than a shorthand notation for gettext.
 *
 * Alias for `i18next.t`.
 *
 *  @param {...string} args see i18next.t docs.
 *
 * @return {String} The translation.
 */
export const t = (...args) => i18next.t(...args)

import chalk from 'chalk'
import * as dataSourceConfig from 'data-source-config'
import * as gameObjects from 'game-objects'
import i18next from 'i18next'
import _ from 'lodash'

// By default, what key to inspect on the runtime config
// dictionary for whether or not we'll run the underlying i18next in debug mode
const I18NEXT_DEBUG_KEY = 'I18NEXT_DEBUG'

// Default formatters for i18next, see: https://www.i18next.com/translation-function/formatting
// key is the formatter name token
export const _formatters = {
  // callable: {{blah, colorize}}
  // if typeof blah === string, just print
  // if typeof blah.color === string, print via chalk.hex(blah.color)(blah.label)
  colorize: (value, format, lng) => {
    const color = _.get(value, 'color')
    const label = _.get(value, 'label')
    if (color) {
      return chalk.hex(color)(label)
    } else {
      // assume string
      return value
    }
  },
  // callable: {{someGameObject, commonName}}
  // tries to display the best name possible.
  commonName: (value, format, lng) => {
    return gameObjects.common.name(value)
  }
}

/**
 * Call this on app start up.
 *
 * @param {object} args as dictionary
 * @param {string} [args.lng='en'] default language and language resources to use
 * @param {string} [args.ns='translation'] default namespace
 * @param {...object} [args.restConfig] any additional key/value pair overrides
 * that will be passed directly to `i18next.init()`.
 * @param {object} config as dictionary of DI utilities (makes testing easier).
 * @param {function} [config.isDebug] function used to determine if we're in
 * debug mode or not, if not explicitly overridden with `args.debug`.
 * @param {function} [config.init] wrapper method for `i18next.init`.
 *
 * @return {Promise}
 */
export const init = async (
  {
    lng = 'en',
    ns = 'translation',
    ...restConfig
  } = {},
  {
    formatters = _formatters,
    isDebug = () => dataSourceConfig.get(I18NEXT_DEBUG_KEY),
    init = (...args) => i18next.init(...args),
  } = {}
) => {
  await init({
    // default namespace to use.
    defaultNS: ns,

    // do not load a fallback, because it'll be english by default.
    fallbackLng: false,

    interpolation: {
      format: function (value, format, lng) {
        if (typeof formatters[format] === 'function') {
          return formatters[format](value, format, lng)
        } else {
          return value
        }
      }
    },

    // Treat default token characters of `:` and `.` as normal characters.
    // Equates to: write phrases in english, fallback to english.
    keySeparator: false,
    nsSeparator: false,

    // Explicitly set language to use.
    lng,

    // string or array of namespaces to load
    ns,

    // resources to initialize with (if not using loading or not appending using addResourceBundle)
    resources: {
      [lng]: {
        [ns]: require(`./${lng}/translation.json`)
      }
    },

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

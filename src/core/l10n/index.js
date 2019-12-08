import chalk from 'chalk'
import * as dataSourceConfig from 'data-source-config'
import * as dataSourceL10n from 'data-source-l10n'
import * as gameObjectsCommon from 'game-objects-common'
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

  // callable: {{someGameObject, commonNames}}
  // tries to display the best name of an object, or the best names as a human
  // list for an array of objects.
  commonName: (value, format, lng) => {
    let values
    if (Array.isArray(value)) {
      values = value
    } else if (value.armies) {
      // Concession to the added complexity of army-groups.
      values = value.armies
    } else {
      values = [value]
    }
    return _.map(values, (v) => gameObjectsCommon.name(v)).join(', ')
  },
}

/**
 * Call this on app start up to populate the cache with the necessary
 * translation strings.
 *
 * @param {object} args as dictionary
 * @param {string} [args.lng='en'] default language and language resources to use
 * @param {string} [args.ns='translation'] default namespace
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
    lng = 'en',
    ns = 'translation',
    ...restConfig
  } = {},
  {
    formatters = _formatters,
    isDebug = () => dataSourceConfig.get(I18NEXT_DEBUG_KEY),
    read = (...args) => i18next.init(...args),
  } = {}
) => {
  await dataSourceL10n.read({lng, ns})
  await read({
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
        [ns]: dataSourceL10n.get({lng, ns})
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

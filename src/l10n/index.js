import * as configRuntime from 'config-runtime'
import i18next from 'i18next'

/**
 * Call this on app start up.
 *
 * @param {object} args as dictionary
 * @param {string} [args.lng] default language and translations to load
 * @param {object} config
 * @param {string} [config.I18NEXT_DEBUG_KEY] what key to inspect on the runtime config
 * dictionary for whether or not we'll run the underlying i18next in debug mode.
 *
 * @return {Promise}
 */
export const init = async ({lng = 'en'} = {}, {I18NEXT_DEBUG_KEY = 'I18NEXT_DEBUG'} = {}) => {
  const config = {
    lng,
    resources: {
      [lng]: {
        translation: require(`./${lng}/translation.json`)
      }
    }
  }

  await i18next.init({
    // allow keys to be phrases having `:`, `.`
    // which equates to write phrases in english, fallback to english.
    nsSeparator: false,
    keySeparator: false,

    // do not load a fallback, because it'll be english by default.
    fallbackLng: false,

    // allow an empty value to count as invalid (by default is true).
    returnEmptyString: false,

    // true report "missing values", false do not report missing values.
    debug: configRuntime.get(I18NEXT_DEBUG_KEY),

    ...config,
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

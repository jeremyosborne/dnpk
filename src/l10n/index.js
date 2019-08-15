const i18next = require('i18next')

module.exports = {
  /**
   * Call this on app start up.
   *
   * @return {Promise}
   */
  init: () => Promise.resolve()
    .then(() => {
      // Configurable and run time options, hard coded for now.
      const lng = 'en'

      return {
        lng,
        resources: {
          en: {
            translation: require(`./${lng}/translation.json`)
          }
        }
      }
    })
    .then((options) => i18next.init({
      ...options,

      // allow keys to be phrases having `:`, `.`
      // which equates to write phrases in english, fallback to english.
      nsSeparator: false,
      keySeparator: false,

      // do not load a fallback, because it'll be english by default.
      fallbackLng: false,

      // allow an empty value to count as invalid (by default is true).
      returnEmptyString: false,

      // true report "missing values", false do not report missing values.
      debug: process.env.I18N_DEBUG,
    })),

  /**
   * Import and as _the_ translation function, since _() has a legacy in JavaScript
   * as somthing other than a shorthand notation for gettext.
   *
   * Alias for `i18next.t`.
   *
   *  @param {varargs} ...args see i18next.t docs.
   *
   * @return {String} The translation.
   */
  t: (...args) => i18next.t(...args),
}

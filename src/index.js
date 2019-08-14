const {army} = require('data')
const i18next = require('i18next')
const _ = require('lodash')

// int main(void)
Promise.resolve()
  .then(() => i18next.init({
    lng: 'en',

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

    resources: {
      en: {
        translation: {}
      }
    }
  }))
  .then(() => {
    console.log(i18next.t('Creating armies.'))

    const armies = _.map([
      'heavy-infantry',
      'light-infantry',
      'wizard',
    ], (name) => army.create(name))

    console.log(i18next.t('Armies created:'))
    console.log(JSON.stringify(armies, null, 4))

    // TODO: work in localization of visual strings while doing the console reporting.

    // Create 2 groups of armies.

    // Engage the 2 groups in battle.

    // Create the attacking group battle structure.

    // Create the defending group battle structure.

    // Run the battle between the groups.

    // Return the battle group structure + statistics.
  })

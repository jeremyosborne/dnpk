const {army} = require('data')
const l10n = require('l10n')
const {t} = require('l10n')
const _ = require('lodash')

// int main(void)
Promise.resolve()
  .then(() => l10n.init())
  .then(() => {
    console.log(t('Creating armies.'))

    const armies = _.map([
      'heavy-infantry',
      'light-infantry',
      'wizard',
    ], (name) => army.create(name))

    console.log(t('Armies created:'))
    console.log(JSON.stringify(armies, null, 4))

    // Create 2 groups of armies.

    // Engage the 2 groups in battle.

    // Create the attacking group battle structure.

    // Create the defending group battle structure.

    // Run the battle between the groups.

    // Return the battle group structure + statistics.
  })

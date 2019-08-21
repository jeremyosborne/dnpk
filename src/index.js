const chalk = require('chalk')
const {army} = require('data')
const l10n = require('l10n')
const {t} = require('l10n')
const _ = require('lodash')

// Temporary view functions.
const showGroup = (group, color) => console.log(`\t${chalk[color](group.reduce((names, instance) => {
  names.push(instance.name)
  return names
}, []).join('\n\t'))}`)

// int main(void)
Promise.resolve()
  .then(() => l10n.init())
  .then(() => {
    console.log(t('Battle prototype'))

    // Explicitly load armies vs. lazy load since we want a list to sample from.
    army.load()

    const armyTypes = army.types.dir()
    console.log(t('Armies available:'))
    _.forEach(armyTypes, (army) => {
      console.log(`\t${chalk.yellow(army)}`)
    })

    // Create 2 groups of armies.

    const dadGroup = _.times(4, () => army.create(_.sample(armyTypes)))
    console.log('Dad the Dictator group:')
    showGroup(dadGroup, 'blue')

    const archerGroup = _.times(4, () => army.create(_.sample(armyTypes)))
    console.log('Archer the Awesome group:')
    showGroup(archerGroup, 'green')

    // Engage the 2 groups in battle.

    // Create the attacking group battle structure.

    // Create the defending group battle structure.

    // Run the battle between the groups.

    // Return the battle group structure + statistics.
  })

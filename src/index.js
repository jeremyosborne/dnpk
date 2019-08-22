const chalk = require('chalk')
const {army} = require('data')
const l10n = require('l10n')
const {t} = require('l10n')
const _ = require('lodash')

/**
 * Calculates the strength of an individual army.
 *
 * @param {object} army instance
 *
 * @return {number} strength of the army
 */
const armyEffectiveStrength = _.flow([
  // Transform object for pipeline.
  (army) => ({army, strength: _.get(army, 'strength')}),
  // Check for elite status.
  // TODO: This needs to be moved to the group strength bonus calculator
  ({army, strength}) => _.filter(_.get(army, 'effects'), (effect) => _.get(effect, 'name') === 'elite')
    .reduce(({army, strength}, eliteEffect) => {
      strength += _.get(eliteEffect, 'magnitude') || 0
      return {army, strength}
    }, {army, strength}),
  // Transform result.
  ({army, strength}) => strength,
])

// Temporary view functions.
const showGroup = (group, color) => console.log(`${chalk[color](group.reduce((info, army) => {
  info.push(`${army.name} (${armyEffectiveStrength(army)})`)
  return info
}, []).join('\n'))}`)

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
      console.log(`${chalk.yellow(army)}`)
    })

    // Create 2 groups of armies.

    console.log('')

    const dadGroup = _.times(4, () => army.create(_.sample(armyTypes)))
    console.log('Dad the Dictator group:')
    showGroup(dadGroup, 'blue')

    console.log('')

    const archerGroup = _.times(4, () => army.create(_.sample(armyTypes)))
    console.log('Archer the Awesome group:')
    showGroup(archerGroup, 'green')

    // Engage the 2 groups in battle.

    // Create the attacking group battle structure.

    // Create the defending group battle structure.

    // Run the battle between the groups.

    // Return the battle group structure + statistics.
  })

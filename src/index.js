const chalk = require('chalk')
const data = require('data')
const l10n = require('l10n')
const {t} = require('l10n')
const _ = require('lodash')

/**
 * Calculates the strength of an individual army without any grouping bonuses.
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
  // Check for strength effects on items.
  ({army, strength}) => {
    const equipment = _.get(army, 'equipment')
    const strengthEffects = _.reduce(equipment, (strengthEffects, eq) => {
      return strengthEffects.concat(
        _.filter(_.get(equipment, 'effects'), (effect) => _.get(effect, 'name') === 'strength')
      )
    }, [])
    return strengthEffects.reduce(({army, strength}, strengthEffect) => {
      strength += _.get(strengthEffect, 'magnitude') || 0
      return {army, strength}
    }, {army, strength})
  },
  // Reduce to just the result we want.
  ({army, strength}) => strength,
])

// Temporary view functions.
const showGroup = (group, color) => console.log(`${chalk[color](group.reduce((info, army) => {
  info.push(`${army.name} (${armyEffectiveStrength(army)})`)
  return info
}, []).join('\n'))}`)

// int main(void)
Promise.resolve()
  .then(() => {
    // Load string translations.
    l10n.init()
  })
  .then(() => {
    // Load data types, keep in dependency order to prevent angry JSON-Schemas.
    data.effect.load()
    data.equippable.load()
    data.army.load()
  })
  .then(() => {
    console.log(t('Battle prototype'))

    const armyTypes = data.army.types.dir()
    console.log(t('Armies available:'))
    _.forEach(armyTypes, (army) => {
      console.log(`${chalk.yellow(army)}`)
    })

    // Create 2 groups of armies.

    console.log('')

    const dadGroup = _.times(4, () => data.army.create(_.sample(armyTypes)))
    console.log('Dad the Dictator group:')
    // Equip heroes with items.
    _.filter(dadGroup, (a) => _.some(_.get(a, 'effects'), (eff) => eff.name === 'hero'))
      .forEach((a) => {
        const eq = data.equippable.create(_.sample(data.equippable.types.dir()))
        console.log(`Equipping ${a.nameInstance || a.name} with ${eq.name}`)
        a.equipment.push(eq)
      })
    showGroup(dadGroup, 'blue')

    console.log('')

    const archerGroup = _.times(4, () => data.army.create(_.sample(armyTypes)))
    console.log('Archer the Awesome group:')
    // Equip heroes with items.
    _.filter(archerGroup, (a) => _.some(_.get(a, 'effects'), (eff) => eff.name === 'hero'))
      .forEach((a) => {
        const eq = data.equippable.create(_.sample(data.equippable.types.dir()))
        console.log(`Equipping ${a.nameInstance || a.name} with ${eq.name}`)
        a.equipment.push(eq)
      })
    showGroup(archerGroup, 'green')

    // Engage the 2 groups in battle.

    // Create the attacking group battle structure.

    // Create the defending group battle structure.

    // Run the battle between the groups.

    // Return the battle group structure + statistics.
  })
  .catch((err) => {
    console.error('something broke in the promise chain, have an error:')
    console.error(err)
  })

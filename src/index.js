const chalk = require('chalk')
const configGameObjects = require('config-game-objects')
const gameObjects = require('game-objects')
const l10n = require('l10n')
const {t} = require('l10n')
const _ = require('lodash')
const sprintf = require('sprintf-js').sprintf

/**
 * Calculates the army bonus for the group.
 *
 * @param {array} group array of army instances.
 *
 * @return {number} the strength bonus provided by this group.
 */
const armyGroupStrengthBonus = _.flow([
  // Transform object for pipeline
  (group) => ({bonus: 0, group}),

  // Elite bonus, applied one time by any unit that has elite status.
  ({group, bonus}) => {
    if (_.some(group, (army) => _.some(army.effects, (effect) => effect.name === 'elite'))) {
      bonus += 1
    }
    return {bonus, group}
  },

  // Flyer bonus, applied one time by any unit that can be airborne (aerial).
  ({group, bonus}) => {
    if (_.some(group, (army) => _.some(army.effects, (effect) => effect.name === 'aerial'))) {
      bonus += 1
    }
    return {bonus, group}
  },

  // Command bonus from equipped items.
  // Check for strength effects on items.
  ({group, bonus}) => {
    // Aggregate all equipment.
    const equipment = _.reduce(group, (equipment, army) => {
      return equipment.concat(army.equipment || [])
    }, [])
    const commandEffects = _.reduce(equipment, (effects, eq) => {
      return effects.concat(
        _.filter(eq.effects, (effect) => effect.name === 'command')
      )
    }, [])
    bonus += _.reduce(commandEffects, (commandBonus, commandEffect) => {
      return commandBonus + (commandEffect.magnitude || 0)
    }, 0)
    return {group, bonus}
  },

  // Hero bonus.
  ({group, bonus}) => {
    const heroes = _.filter(group, (army) => _.some(army.effects, (effect) => effect.name === 'hero'))

    bonus += _.reduce(heroes, (heroBonus, hero) => {
      const heroStrength = armyEffectiveStrength(hero)
      if (heroStrength >= 4 && heroStrength <= 6) {
        return heroBonus + 1
      } else if (heroStrength >= 7 && heroStrength <= 8) {
        return heroBonus + 2
      } else if (heroStrength >= 9) {
        return heroBonus + 3
      } else {
        return heroBonus
      }
    }, 0)

    return {bonus, group}
  },

  //
  // TODO: Add command item bonuses (carried by heroes)
  //

  // Reduce to just the result we want.
  ({group, bonus}) => bonus,
])

/**
 * Calculates the strength of an individual army without any grouping bonuses.
 *
 * @param {object} army instance
 *
 * @return {number} strength of the army
 */
const armyEffectiveStrength = _.flow([
  // Transform object for pipeline.
  (army) => ({army, strength: army.strength || 0}),

  // Check for strength effects on items.
  ({army, strength}) => {
    const equipment = army.equipment
    const strengthEffects = _.reduce(equipment, (effects, eq) => {
      return effects.concat(
        _.filter(eq.effects, (effect) => effect.name === 'strength')
      )
    }, [])
    strength += _.reduce(strengthEffects, (strengthBonus, strengthEffect) => {
      return strengthBonus + (strengthEffect.magnitude || 0)
    }, 0)

    return {army, strength}
  },

  // TODO: cap the strength.

  // Reduce to just the result we want.
  ({army, strength}) => strength,
])

// Temporary view functions.
const showGroup = (group, color, groupStrengthBonus) => console.log(`${chalk[color](group.reduce((info, army) => {
  const effectiveStrength = armyEffectiveStrength(army)
  info.push(`${sprintf('%-17s', army.name)} ${sprintf('Str: %-3s', army.strength)} (Eff Str: ${effectiveStrength}) (Battle Str: ${Math.min(9, effectiveStrength + groupStrengthBonus)})`)
  return info
}, []).join('\n'))}`)

// int main(void)
Promise.resolve()
  .then(() => {
    // Load string translations.
    return l10n.init()
  })
  .then(() => {
    // Load user configurable entity definitions.
    return configGameObjects.load()
  })
  .then(() => {
    console.log(t('Battle prototype'))

    const armyTypes = gameObjects.army.dir()
    console.log(t('Armies available:'))
    console.log(chalk.yellow(_.sortBy(armyTypes).join('\n')))

    // Create 2 groups of armies.

    console.log('')

    const dadGroup = _.times(4, () => gameObjects.army.create({name: _.sample(armyTypes)}))
    console.log('Dad the Dictator group:')
    // Equip heroes with items.
    _.filter(dadGroup, (a) => _.some(_.get(a, 'effects'), (eff) => eff.name === 'hero'))
      .forEach((a) => {
        const eq = gameObjects.equippable.create({name: _.sample(gameObjects.equippable.dir())})
        console.log(`Equipping ${a.nameInstance || a.name} with ${eq.name}`)
        a.equipment.push(eq)
      })
    const dadGroupStrengthBonus = armyGroupStrengthBonus(dadGroup)
    console.log(t('Army group bonus: {{bonus}}', {bonus: dadGroupStrengthBonus}))
    showGroup(dadGroup, 'blue', dadGroupStrengthBonus)

    console.log('')

    const archerGroup = _.times(4, () => gameObjects.army.create({name: _.sample(armyTypes)}))
    console.log('Archer the Awesome group:')
    // Equip heroes with items.
    _.filter(archerGroup, (a) => _.some(_.get(a, 'effects'), (eff) => eff.name === 'hero'))
      .forEach((a) => {
        const eq = gameObjects.equippable.create({name: _.sample(gameObjects.equippable.dir())})
        console.log(`Equipping ${a.nameInstance || a.name} with ${eq.name}`)
        a.equipment.push(eq)
      })
    const archerGroupStrengthBonus = armyGroupStrengthBonus(archerGroup)
    console.log(t('Army group bonus: {{bonus}}', {bonus: archerGroupStrengthBonus}))
    showGroup(archerGroup, 'green', archerGroupStrengthBonus)

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

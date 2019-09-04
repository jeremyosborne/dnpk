import strength from '../strength'
import _ from 'lodash'

/**
 * Calculates the strength modifier from an army group which gets applied to
 * the army during battle.
 *
 * @param {object[]} group array of army instances.
 *
 * @return {number} the strength bonus provided by this group.
 */
export const strengthModifier = _.flow([
  // Transform object for pipeline
  (group) => ({modifier: 0, group}),

  // Elite bonus, applied one time by any unit that has elite status.
  ({group, modifier}) => {
    if (_.some(group, (army) => _.some(army.effects, (effect) => effect.name === 'elite'))) {
      modifier += 1
    }
    return {modifier, group}
  },

  // Flyer bonus, applied one time by any unit that can be airborne (aerial).
  ({group, modifier}) => {
    if (_.some(group, (army) => _.some(army.effects, (effect) => effect.name === 'aerial'))) {
      modifier += 1
    }
    return {modifier, group}
  },

  // Command bonus from equipped items.
  // Check for strength effects on items.
  ({group, modifier}) => {
    // Aggregate all equipment.
    const equipment = _.reduce(group, (equipment, army) => {
      return equipment.concat(army.equipment || [])
    }, [])
    const commandEffects = _.reduce(equipment, (effects, eq) => {
      return effects.concat(
        _.filter(eq.effects, (effect) => effect.name === 'command')
      )
    }, [])
    modifier += _.reduce(commandEffects, (commandBonus, commandEffect) => {
      return commandBonus + (commandEffect.magnitude || 0)
    }, 0)
    return {group, modifier}
  },

  // Hero bonus.
  ({group, modifier}) => {
    const heroes = _.filter(group, (army) => _.some(army.effects, (effect) => effect.name === 'hero'))

    modifier += _.reduce(heroes, (heroBonus, hero) => {
      const heroStrength = strength(hero)
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

    return {modifier, group}
  },

  // Reduce to just the result we want.
  ({group, modifier}) => modifier,
])

export default strengthModifier

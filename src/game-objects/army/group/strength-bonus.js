import strength from '../strength'
import _ from 'lodash'

/**
 * Calculates the army bonus for the group.
 *
 * @param {array} group array of army instances.
 *
 * @return {number} the strength bonus provided by this group.
 */
export const strengthBonus = _.flow([
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

    return {bonus, group}
  },

  //
  // TODO: Add command item bonuses (carried by heroes)
  //

  // Reduce to just the result we want.
  ({group, bonus}) => bonus,
])

export default strengthBonus

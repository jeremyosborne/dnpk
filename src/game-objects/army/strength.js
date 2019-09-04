import _ from 'lodash'

/**
 * Calculates the effective strength of an individual army.
 *
 * @param {object} army instance
 *
 * @return {number} strength of the army
 */
export const strength = _.flow([
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
    strength += _.reduce(strengthEffects, (strengthModifier, strengthEffect) => {
      return strengthModifier + (strengthEffect.magnitude || 0)
    }, 0)

    return {army, strength}
  },

  // TODO: cap the strength.

  // Reduce to just the result we want.
  ({army, strength}) => strength,
])

export default strength

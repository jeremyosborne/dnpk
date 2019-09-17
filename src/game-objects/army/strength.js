import _ from 'lodash'
import {strengthBounded} from '../rules'

/**
 * Calculates the effective strength of an individual army.
 *
 * @param {object} army instance
 *
 * @return {number} strength of the army
 */
export const strength = _.flow([
  // Transform object for pipeline.
  // For the initial strength, prefer lower bounds determined by game rules.
  (army) => ({army, strength: army.strength || strengthBounded(-Infinity)}),

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

  // Reduce to just the result we want.
  // At no time should an individual army unit be above 9 on its own so it should
  // be safe to cap it here as this isn't an unbounded modifier but a stat that
  // has in game constraints.
  ({army, strength}) => strengthBounded(strength),
])

export default strength

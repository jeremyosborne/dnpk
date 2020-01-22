import * as effects from './effects'
import * as equipment from './equipment'

/**
 * Calculates the effective, unbounded health of an individual army.
 *
 * Effective health = base health + individual army effects
 *
 * @param {object} args
 * @param {object} args.army army to calculate effective health of.
 *
 * @return {number} effective health of the army
 */
export const health = ({
  army
} = {}) => {
  let health = army && army.health ? army.health : 0
  // Strength from equipment.
  health += equipment.healthModifierConstitution(army)
  // Strength from effects.
  health += effects.healthModifierConstitution(army)

  return health
}

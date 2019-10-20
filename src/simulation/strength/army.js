import equipmentStrengthModifier from './equipment'
import {strengthBounded} from 'game-rules'

/**
 * Calculates the effective strength of an individual army.
 *
 * Effective strength = base strength + individual army effects
 *
 * This is needed due to calculations further based on the strength of the
 * individual army, namely the hero strength-modifier based on the strength
 * of the hero.
 *
 * @param {object} args
 * @param {object} args.army army to calculate effective strength of.
 *
 * @return {number} effective strength of the army
 */
export const strength = ({army}) => {
  let strength = 0

  if (army) {
    strength = army.strength || 0
    // Check for strength-modifiers from items; army implements `equipment`.
    strength += equipmentStrengthModifier(army)
  }

  //
  // TODO: Calculate bonuses from shrine effects.
  //

  //
  // TODO: Calculate bonuses from battle / experience / rank effects.
  //

  // At no time should an individual army unit be above 9, or whatever the
  // max strenth is, on its own. It should  be safe to cap it here as this isn't
  // an unbounded modifier but a stat that has in game constraints.
  return strengthBounded(strength)
}

export default strength

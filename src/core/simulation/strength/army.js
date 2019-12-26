import * as effects from './effects'
import * as equipment from './equipment'
import * as gameObjectsCommon from 'game-objects-common'

/**
 * Calculate the strength modifier from a hero unit.
 *
 * This method is somewhat awkard since it needs the effective strength of the
 * hero, which includes `equippables` that provide `brawn` as well as `brawn`
 * `effect`s to calculate correctly. The modifier itself is an aura effect
 * provided to all armies in the army-group, including the hero providing the
 * bonus.
 *
 * @param {object} args
 * @param {object} args.army army to test for hero bonus.
 *
 * @return {number} the strength modifier or 0
 */
export const strengthModifierHero = ({army = {}} = {}) => {
  if (!gameObjectsCommon.is.hero(army)) {
    return 0
  }

  const heroStrength = strength({army})
  if (heroStrength < 4) {
    return 0
  } else if (heroStrength >= 4 && heroStrength <= 6) {
    return 1
  } else if (heroStrength >= 7 && heroStrength <= 8) {
    return 2
  } else if (heroStrength >= 9) {
    return 3
  }
}

/**
 * Calculates the effective, unbounded strength of an individual army.
 *
 * Effective strength = base strength + individual army effects
 *
 * This is needed due to calculations further based on the strength of the
 * individual army + equipment + effects without other aura based modifiers.
 *
 * @param {object} args
 * @param {object} args.army army to calculate effective strength of.
 *
 * @return {number} effective strength of the army
 */
export const strength = ({
  army
} = {}) => {
  let strength = army && army.strength ? army.strength : 0
  // Strength from equipment.
  strength += equipment.strengthModifierBrawn(army)
  // Strength from effects.
  strength += effects.strengthModifierBrawn(army)

  return strength
}

export default strength

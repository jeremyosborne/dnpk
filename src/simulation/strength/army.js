import * as effects from './effects'
import * as equipment from './equipment'
import * as gameObjects from 'game-objects'
import {strengthBounded} from 'game-rules'
import _ from 'lodash'

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
  if (!gameObjects.army.is.hero(army)) {
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
 * Calculates total `brawn` based modifier that an `army` type could have.
 *
 * @param {Object} args
 * @param {Object} [args.army={}] the army for which to compute the modifier.
 * @param {object} [config] configuration as dictionary
 * @param {function[]} [config.modifierFns] which modifier functions will be
 * used to calculate the terrain strength modifier.
 *
 * @return {number} brawn modifier, or 0
 */
export const strengthModifierBrawn = ({
  army = {}
} = {}, {
  modifierFns = [
    equipment.strengthModifierBrawn,
    effects.strengthModifierBrawn,
  ],
} = {}) => {
  return _.reduce(modifierFns, (modifier, fn) => {
    // Due to how functions are implemented, the modifier functions expect an
    // object that implement something, and we pass the army as the container
    // object that implements the interface from which the strength-modifier
    // is computed.
    return modifier + fn(army)
  }, 0)
}

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
 * @param {object} [config] configuration as dictionary
 * @param {function[]} [config.modifierFns] which modifier functions will be
 * used to calculate the terrain strength modifier.
 *
 * @return {number} effective strength of the army
 */
export const strength = ({
  army
} = {}, {
  modifierFns = [
    strengthModifierBrawn,
  ],
} = {}) => {
  // Args passed to strength modifier callbacks.
  const fnArgs = {army}

  let strength = army && army.strength ? army.strength : 0
  strength += _.reduce(modifierFns, (modifier, fn) => {
    return modifier + fn(fnArgs)
  }, 0)

  // At no time should an individual army unit be above 9, or whatever the
  // max strenth is, on its own. It should  be safe to cap it here as this isn't
  // an unbounded modifier but a stat that has in game constraints.
  return strengthBounded(strength)
}

export default strength

import * as effects from './effects'
import _ from 'lodash'

/**
 * Calculates total `brawn-aura` based modifier of a `stucture`.
 *
 * @param {Object} args
 * @param {Object} [args.army={}] the army for which to compute the modifier.
 * @param {object} [config] configuration as dictionary
 * @param {function[]} [config.modifierFns] which modifier functions will be
 * used to calculate the terrain strength modifier.
 *
 * @return {number} brawn modifier, or 0
 */
export const strengthModifierBrawnAura = ({
  structure = {}
} = {}, {
  modifierFns = [
    effects.strengthModifierBrawnAura,
  ],
} = {}) => {
  return _.reduce(modifierFns, (modifier, fn) => {
    // Due to how functions are implemented, the effects modifier functions expect an
    // object that implements something, and we pass the army as the container
    // object that implements the interface from which the strength-modifier
    // is computed.
    return modifier + fn(structure)
  }, 0)
}

/**
 * Calculates the strength modifier provided by the structure.
 *
 * @param {object} args
 * @param {object} args.structure from which to calculate bonus.
 *
 * @param {object} [config] configuration as dictionary
 * @param {function[]} [config.modifierFns] which modifier functions will be
 * used to calculate the terrain strength modifier.
 *
 * @return {number} strength modifier provided by the structure, or 0.
 */
export const strengthModifier = ({
  structure
} = {}, {
  modifierFns = [
    strengthModifierBrawnAura,
  ],
} = {}) => {
  // Args passed to strength modifier callbacks.
  const fnArgs = {structure}

  return _.reduce(modifierFns, (modifier, fn) => {
    return modifier + fn(fnArgs)
  }, 0)
}

export default strengthModifier

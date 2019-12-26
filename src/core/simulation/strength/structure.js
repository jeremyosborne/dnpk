import * as effects from './effects'

/**
 * Calculates the strength modifier provided by a structure.
 *
 * @param {object} args
 * @param {object} args.structure from which to calculate bonus.
 *
 * @return {number} strength modifier provided by the structure, or 0.
 */
export const strengthModifier = ({
  structure
} = {}) => {
  return effects.strengthModifierBrawnAura(structure)
}

export default strengthModifier

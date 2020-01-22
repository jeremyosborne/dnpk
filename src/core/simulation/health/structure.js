import * as effects from './effects'

/**
 * Calculates the health modifier provided by a structure.
 *
 * @param {object} args
 * @param {object} args.structure from which to calculate bonus.
 *
 * @return {number} health modifier provided by the structure, or 0.
 */
export const healthModifier = ({
  structure
} = {}) => {
  return effects.healthModifierConstitutionAura(structure)
}

export default healthModifier

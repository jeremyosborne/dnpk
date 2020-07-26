import armyStrength from './army'
import armyGroupStrengthModifier from './army-group'
import constrainStrengthWithinRuleBoundaries from './constrain-strength-within-rule-boundaries'
import constrainStrengthModifierWithinRuleBoundaries from './constrain-strength-modifier-within-rule-boundaries'
import _ from 'lodash'
import structureStrengthModifier from './structure'
import terrainStrengthModifier from './terrain'

/**
 * Calculate the effective strength and cap based on game rules.
 *
 * Other than the army, all other input is optional and should only be passed
 * if you wish to use the item to affect the strength of the unit.
 *
 * @param {object} args params as arguments
 * @param {object} args.army the army providing the base strength
 * @param {object} [args.armyGroup] that the army presumably belongs to. This will
 * calculate and provide an army group modifier and add it to the strength.
 * @param {object} [args.empire] that the army presumably belongs to. This will provide
 * any empire modifications (e.g. terrain bonuses in the classic rules) to the final
 * strength.
 * @param {array|object} [args.structures] that affect the army.
 * @param {array|object} [args.terrains] that affect the army.
 *
 * @return {number} strength that is valid within the range provided by the game
 * rules.
 *
 * @throw {Error} if requried arguments are missing.
 */
export const strength = ({army, armyGroup, empire, structures, terrains}) => {
  if (!army) {
    throw new Error('At minimum you need to pass `army` as strength calculation is relative to that.')
  }

  const strength = armyStrength({army})
  const groupModifier = armyGroupStrengthModifier({armyGroup})
  const terrainModifier = _.reduce(
    _.isArray(terrains) ? terrains : [terrains],
    (modifier, terrain) => terrainStrengthModifier({army, empire, terrain}) + modifier,
    0
  )
  const structureModifier = _.reduce(
    _.isArray(structures) ? structures : [structures],
    (modifier, structure) => structureStrengthModifier({structure}) + modifier,
    0
  )
  const modifier = constrainStrengthModifierWithinRuleBoundaries(groupModifier + terrainModifier + structureModifier)

  return constrainStrengthWithinRuleBoundaries(strength + modifier)
}

export default strength

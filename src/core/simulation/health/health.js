import {health as armyHealth} from './army'
import {healthModifier as armyGroupHealthModifier} from './army-group'
import constrainHealthWithinRuleBoundaries from './constrain-health-within-rule-boundaries'
import constrainHealthModifierWithinRuleBoundaries from './constrain-health-modifier-within-rule-boundaries'
import structureHealthModifier from './structure'

/**
 * Calculate the effective health and cap based on game rules.
 *
 * Other than the army, all other input is optional and should only be passed
 * if you wish to use the objects to affect the health of the unit.
 *
 * @param {object} args params as arguments
 * @param {object} args.army the army providing the base health
 * @param {object} [args.armyGroup] that the army presumably belongs to. This will
 * calculate and provide an army group modifier and add it to the health.
 * @param {object} [args.structure] that the army presumably occupies.
 *
 * @return {number} health that is valid within the range provided by the game
 * rules.
 *
 * @throw {Error} if requried arguments are missing.
 */
export const health = ({army, armyGroup, structure}) => {
  if (!army) {
    throw new Error('At minimum you need to pass `army` as health calculation is relative to that.')
  }

  const health = armyHealth({army})
  const groupModifier = armyGroupHealthModifier({armyGroup})
  const structureModifier = structureHealthModifier({structure})
  const modifier = constrainHealthModifierWithinRuleBoundaries(groupModifier + structureModifier)

  return constrainHealthWithinRuleBoundaries(health + modifier)
}

export default health

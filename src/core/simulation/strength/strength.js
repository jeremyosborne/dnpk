import armyStrength from './army'
import armyGroupStrengthModifier from './army-group'
import {strengthBounded} from 'game-rules'
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
 * @param {object} [args.structure] that the army presumably occupies, likely applies
 * to defending troops more than attacking troops.
 * @param {object} [args.terrain] to use for modification of the strength. In
 * classic rules armies and empires (dis)liked particular terrain.
 *
 * @return {number} strength that is valid within the range provided by the game
 * rules.
 *
 * @throw {Error} if requried arguments are missing.
 */
export const strength = ({army, armyGroup, empire, structure, terrain}) => {
  if (!army) {
    throw new Error('At minimum you need to pass `army` as strength calculation is relative to that.')
  }

  let strength = armyStrength({army})
  strength += armyGroupStrengthModifier({armyGroup})
  strength += terrainStrengthModifier({army, empire, terrain})
  strength += structureStrengthModifier({structure})

  return strengthBounded(strength)
}

export default strength

import armyStrength from './army'
import armyGroupStrengthModifier from './army-group'
import {strengthBounded} from 'game-rules'
import terrainStrengthModifier from './terrain'

/**
 * Calculate the effective strength given all inputs, and cap based on game rules.
 *
 * @param {object} args params as arguments
 * @param {object} args.army the army providing the base strength
 * @param {object} args.armyGroup that the army presumably belongs to. This will
 * calculate and provide an army group modifier and add it to the strength.
 * @param {object} args.empire the the army presumably belongs to. This will provide
 * any empire modifications (e.g. terrain bonuses in the classic rules) to the final
 * strength.
 * @param {object} args.terrain to use for modification of the strength. In
 * classic rules the armies and the empires provided terrain modifications.
 *
 * @return {number} strength that is valid within the game rules set.
 *
 * @throw {Error} if requried arguments are missing.
 */
export const strength = ({army, armyGroup, empire, terrain}) => {
  if (!army) {
    throw new Error('At minimum you need to pass `army` as strength calculation is relative to that.')
  }

  let strength = armyStrength({army})
  strength += armyGroupStrengthModifier({armyGroup})
  strength += terrainStrengthModifier({army, empire, terrain})

  return strengthBounded(strength)
}

export default strength

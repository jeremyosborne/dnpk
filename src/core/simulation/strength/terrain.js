import debug from 'debug'
import _ from 'lodash'

const _logger = debug('dnpk/strength/terrain-strength-modifier')

/**
 * Calculate the strength modifier for a particular army fighting on a particular
 * terrain.
 *
 * @param {object} args main arguments as dictionary
 * @param {object} args.army
 * @param {object} args.terrain where the army is fighting
 * @param {object} [config] configuration as dictionary
 * @param {object} [config.logger] oddities will get reported.
 *
 * @return {number} the strength modifier provided by combination of army and terrain,
 * if any. 0 is the default return value.
 */
export const strengthModifierTerrainArmy = (
  {army, terrain},
  {
    logger = _logger
  } = {}
) => {
  if (army && terrain) {
    return _.reduce(army.effects, (terrainModifier, effect) => {
      if (effect.name === 'brawn-terrain-modifier' && _.includes(effect.metadata.appliesTo, terrain.name)) {
        const modification = effect.magnitude || 0
        if (!modification) {
          logger(`Likely error where magnitude of a terrain modifier is zero. Army: ${army}; Terrain: ${terrain}.`)
        }
        return terrainModifier + modification
      } else {
        return terrainModifier
      }
    }, 0)
  } else {
    return 0
  }
}

/**
 * Calculate the strength modifier for armies in a particular empire fighting
 * on specific terrain.
 *
 * @param {object} args main arguments as dictionary
 * @param {object} args.empire of the armies
 * @param {object} args.terrain where the armies are fighting
 * @param {object} [config] configuration as dictionary
 * @param {object} [config.logger] oddities will get reported.
 *
 * @return {number} the strength modifier provided by combination of empire and terrain,
 * if any. 0 is the default return value.
 */
export const strengthModifierTerrainEmpire = (
  {empire, terrain},
  {
    // no logging by default.
    logger = _logger
  } = {}
) => {
  if (empire && terrain) {
    return _.reduce(empire.effects, (terrainModifier, effect) => {
      if (effect.name === 'brawn-terrain-modifier' && _.includes(effect.metadata.appliesTo, terrain.name)) {
        const modification = effect.magnitude || 0
        if (!modification) {
          logger(`Likely error where magnitude of a terrain modifier is zero: empire: ${empire}; terrain: ${terrain}`)
        }
        return terrainModifier + modification
      } else {
        return terrainModifier
      }
    }, 0)
  } else {
    return 0
  }
}

/**
 * Calculates the strength modifier that would affect a specific army from a specific
 * empire on a specific piece of a terrain.
 *
 * Depending on how this method is called, one can derive the effect of the terrain
 * on a neutral army or the terrain on any army of a particular empire.
 *
 * @param {object} args
 * @param {object} [args.army] the army effected by the terrain. To caclulate just
 * the modifier an army receives from a piece of terrain, don't pass the empire.
 * @param {object} [args.empire] the empire to which an army belongs. To
 * caclulate just the modifier provided by an empire when battling in a specific
 * terrain, don't pass the army.
 * @param {object} args.terrain the terrain where the battle is taking place
 *
 * @return {number} the strength modifier provided to the particular army
 */
export const strengthModifier = ({army, empire, terrain}) => {
  let modifier = 0
  modifier += strengthModifierTerrainArmy({terrain, army})
  modifier += strengthModifierTerrainEmpire({terrain, empire})
  return modifier
}

export default strengthModifier

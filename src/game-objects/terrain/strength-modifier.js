import debug from 'debug'
import _ from 'lodash'

const logger = debug('dnpk/game-objects/terrain/strength-modifier')

/**
 * Calculates the strength modifier that would affect a specific army from a specific
 * empire on a specific piece of a terrain.
 *
 * @param {object} args
 * @param {object} [args.army] the unit effected by the terrain. To caclulate just
 * the modifier an army receives from a piece of terrain, don't pass the empire.
 * @param {object} [args.empire] the empire to which an army belongs. To
 * caclulate just the modifier provided by an empire when battling in a specific
 * terrain, don't pass the army.
 * @param {object} args.terrain the terrain where the battle is taking place
 *
 * @return {number} the strength modifier provided to the particular army
 */
export const strengthModifier = _.flow([
  // Transform object for pipeline
  ({army, empire, terrain}) => ({army, empire, modifier: 0, terrain}),

  // Check for empire opinion of terrain.
  ({army, empire, modifier, terrain}) => {
    if (empire && terrain) {
      modifier += _.reduce(empire.effects, (terrainModifier, effect) => {
        // We assume nested structure `metadata.name` is required for terrain.
        if (effect.name === 'terrain-battle-modifier' && effect.metadata.name === terrain.name) {
          const modification = effect.magnitude || 0
          if (!modification) {
            logger(`Likely error where magnitude of a terrain modifier is zero. Army: ${army}; Terrain: ${terrain}.`)
          }
          return terrainModifier + modification
        } else {
          return terrainModifier
        }
      }, 0)
    }

    return {army, empire, modifier, terrain}
  },

  // Check for army opinion of terrain.
  ({army, empire, modifier, terrain}) => {
    if (army && terrain) {
      modifier += _.reduce(army.effects, (terrainModifier, effect) => {
        // We assume nested structure `metadata.name` is required for terrain.
        if (effect.name === 'terrain-battle-modifier' && effect.metadata.name === terrain.name) {
          const modification = effect.magnitude || 0
          if (!modification) {
            logger(`Likely error where magnitude of a terrain modifier is zero. Army: ${army}; Terrain: ${terrain}.`)
          }
          return terrainModifier + modification
        } else {
          return terrainModifier
        }
      }, 0)
    }

    return {army, empire, modifier, terrain}
  },

  // Reduce to modifier.
  ({army, empire, modifier, terrain}) => modifier,
])

export default strengthModifier

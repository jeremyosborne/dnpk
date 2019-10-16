//
// Different ways to random sample army types.
//
// This module works directly with the underlying data to avoid any potential
// of bizarre circular imports within the game-objects module. The `game-object`
// submodules should supply a sufficient public API that these functions are
// rarely needed.
//

import * as dataSourceGameObjects from 'data-source-game-objects'
import * as armyIs from './is'
import _ from 'lodash'
import * as randomModule from 'random'
import armyStrength from './strength'

/**
 * Create random set of armies.
 *
 * This function governs the rules for choosing a set of armies around general weighting
 * rules. Convenience methods are exposed elsewhere as `*.random` for singular
 * `army` and `army-group` construction that apply defaults for their respective
 * uses. Recommend using those functions.
 *
 * @param {object} args
 * @param {number} [size=1] how many choices to return.
 *
 * @return {string[]} a random list of army `name`s.
 *
 * @throw {Error} if there appear to be no armies loaded.
 */
export const random = ({size = 1} = {}) => {
  const names = dataSourceGameObjects.types.army.dir()
  if (!names.length) {
    throw new Error('army.random.random: no army names available. Did you load the armies before calling this method?')
  }

  return _.sampleSize(names, size)
}

/**
 * Create random-but-weighted set of armies.
 *
 * This function governs the rules for choosing a set of armies around general weighting
 * rules. Convenience methods are exposed elsewhere as `*.random.weighted` for singular
 * `army` and `army-group` construction that apply defaults for their respective
 * uses. Recommend using those functions.
 *
 * @param {object} args
 * @param {number} [size=1] how many choices to return.
 *
 * @return {string[]} a random-by-weighting list of army `name`s.
 *
 * @throw {Error} if there appear to be no armies loaded.
 */
export const weighted = ({size = 1} = {}) => {
  const names = dataSourceGameObjects.types.army.dir()
  if (!names.length) {
    throw new Error('army.random.weighted: no army names available. Did you load the armies before calling this method?')
  }

  return randomModule.sampleWeighted({
    choices: names,
    size,
    // Rules for choosing random armies.
    weight: (name) => {
      // We need information provided by the refs to determine the weight of the indvidual
      // army.
      const a = dataSourceGameObjects.types.army.get(name)

      // Heroes lowest weight.
      if (armyIs.hero(a)) {
        return 1
      }

      // Individual army strength determines how an army is chosen and we make sure
      // everything has a higher chance of being picked over a hero.
      const strength = armyStrength(a)
      return 10 - strength + 2 * (10 - strength)
    }
  })
}

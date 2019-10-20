import * as dataSourceModdables from 'data-source-moddables'
import * as gameObjects from 'game-objects'
import _ from 'lodash'
import * as randomModule from 'random'

/**
 * Randomly choose a set of armies from a weighted set of choices.
 *
 * This function governs the rules for choosing a set of armies around general weighting
 * rules. Convenience methods are exposed elsewhere. Recommend using those functions.
 *
 * @param {object} args
 * @param {object} [args.exclude] keys with truthy values will be excluded from the
 * potential set from which we sample.
 * @param {number} [args.size=1] how many choices to return.
 *
 * @return {string[]} a random-by-weighting list of army `name`s.
 *
 * @throw {Error} if there appear to be no armies loaded.
 */
export const randomWeightedArmies = ({
  exclude = {},
  size = 1,
} = {}) => {
  const names = _.filter(gameObjects.army.dir(), (name) => !exclude[name])
  if (!names.length) {
    throw new Error('randomWeightedArmies: no army names available. Did you load the armies before calling this method?')
  }

  return randomModule.sampleWeighted({
    choices: names,
    size,
    // Rules for choosing random armies.
    weight: (name) => {
      // We need information provided by the refs to determine the weight of the indvidual
      // army.
      const a = dataSourceModdables.types.army.get(name)

      // Heroes lowest weight.
      if (gameObjects.army.is.hero(a)) {
        return 1
      }

      // Individual army strength determines how an army is chosen and we make sure
      // everything has a higher chance of being picked over a hero.
      const strength = a.strength
      return 10 - strength + 2 * (10 - strength)
    }
  })
}

export default randomWeightedArmies

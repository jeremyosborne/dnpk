import * as dataSourceModdables from 'data-source-moddables'
import * as gameObjects from 'game-objects'
import * as gameObjectsCommon from 'game-objects-common'
import _ from 'lodash'
import * as random from 'random'

/**
 * Given the `name` of an army, determine its weight.
 *
 * @param {string} name
 *
 * @return {number} weighted chance this army will be chosen (higher === more often)
 * compared to other armies.
 */
export const randomWeightedArmyWeighting = (name) => {
  // We need information provided by the refs to determine the weight of the indvidual
  // army.
  const a = dataSourceModdables.types.army.get(name)

  if (!a) {
    throw new Error(`${name} army does not exist.`)
  }

  // Heroes have the lowest weight and will appear the least often.
  if (gameObjectsCommon.effects.hasName(a, 'hero')) {
    return 1
  }

  // Individual army strength determines how an army is chosen and we make sure
  // everything has a higher chance of being picked over a hero.
  const strength = a.strength
  const weight = 10 - strength + 2 * (10 - strength)
  if (gameObjectsCommon.effects.hasName(a, 'aerial') || gameObjectsCommon.effects.hasName(a, 'elite')) {
    return Math.ceil(weight / 2)
  } else {
    return weight
  }
}

/**
 * Randomly choose a set of armies from a weighted set of choices.
 *
 * This function governs the rules for choosing a set of armies around general weighting
 * rules. Convenience methods are exposed elsewhere. Recommend using those functions.
 *
 * @param {object} args
 * @param {array} [args.exclude] values will be excluded from the potential set
 * from which we sample.
 * @param {number} [args.size=1] how many choices to return.
 *
 * @param {object} [config]
 * @param {function} [config.weight] what weighting function to use, see: random.sampleWeighted.
 *
 * @return {string[]} a random-by-weighting list of army `name`s.
 *
 * @throw {Error} if there appear to be no armies loaded.
 */
export const randomWeightedArmies = ({
  exclude = [],
  size = 1,
} = {}, {
  weight = randomWeightedArmyWeighting,
} = {}) => {
  const names = _.filter(gameObjects.army.dir(), (name) => !_.includes(exclude, name))
  const weights = _.map(names, weight)
  if (!names.length) {
    throw new Error('randomWeightedArmies: no army names available. Did you load the armies before calling this method?')
  }

  return random.choices(names, size, weights)
}

export default randomWeightedArmies

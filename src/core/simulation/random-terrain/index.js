import * as gameObjects from 'game-objects'
import * as random from 'random'

/**
 * Given an elevation style of value, return the equivalent terrain name for that
 * value.
 *
 * @param {number} value floating point value, assumed to be created by a noise
 * or other terrain generation function.
 *
 * @return {string} terrain name
 */
export const valueToName = (value) => {
  if (value <= -0.25) {
    return 'water'
  } else if (-0.25 < value && value <= -0.2) {
    return 'marsh'
  } else if (-0.2 < value && value <= -0.1) {
    return 'shore'
  } else if (-0.1 < value && value <= 0) {
    return 'plain'
  } else if (0 < value && value <= 0.15) {
    return 'forest'
  } else if (0.15 < value && value <= 0.35) {
    return 'hill'
  } else {
    // value > 0.35
    return 'mountain'
  }
}

/**
 * Generate random terrain object at a specific 2d coordinate.
 *
 * @param {object} args
 * @param {number} args.x coordinate
 * @param {number} args.y coordinate
 * @param {number} [args.roc] "rate of change", assumed to be 0 < roc <= 1.
 * Larger numbers provide a more drastic and sudden change between the presumed
 * integer coordinates, smaller numbers output more gradual terrain changes.
 *
 * @return {object} terrain
 */
export const create = ({x, y, roc = 0.3} = {}) => {
  const value = random.noise.perlin(x * roc, y * roc)
  return gameObjects.terrain.create({name: valueToName(value)})
}

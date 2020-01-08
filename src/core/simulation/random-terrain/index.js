import * as gameObjects from 'game-objects'
import * as random from 'random'

/**
 * Generate random terrain name at a specific 2d coordinate.
 *
 * @param {object} args
 * @param {number} args.x coordinate
 * @param {number} args.y coordinate
 *
 * @return {string} terrain name
 */
export const name = ({x, y}) => {
  const value = random.noise.perlin(x, y)
  if (value <= 0.1) {
    return 'water'
  } else if (0.1 < value && value <= 0.12) {
    return 'marsh'
  } else if (0.12 < value && value <= 0.2) {
    return 'shore'
  } else if (0.2 < value && value <= 0.4) {
    return 'plain'
  } else if (0.4 < value && value <= 0.6) {
    return 'forest'
  } else if (0.6 < value && value <= 0.8) {
    return 'hill'
  } else {
    // value > 0.8
    return 'mountain'
  }
}

/**
 * Generate random terrain object at a specific 2d coordinate.
 *
 * @param {object} args
 * @param {number} args.x coordinate
 * @param {number} args.y coordinate
 *
 * @return {object} terrain
 */
export const create = ({x, y}) => {
  return gameObjects.terrain.create({name: name({x, y})})
}

import * as gameObjects from 'game-objects'
import * as random from 'random'

/**
 * Generate random terrain name at a specific 2d coordinate.
 *
 * @param {number} x coordinate
 * @param {number} y coordinate
 *
 * @return {string} terrain name
 */
export const name = ({x, y}) => {
  const value = random.noisePerlin({x, y})
  if (value < -1) {
    return 'water'
  } else if (-1 < value && value <= -0.5) {
    return 'shore'
  } else if (-0.5 < value && value <= -0.2) {
    return 'marsh'
  } else if (-0.2 < value && value <= -0.1) {
    return 'plains'
  } else if (-0.1 < value && value <= 0.1) {
    return 'road'
  } else if (0.1 < value && value <= 0.5) {
    return 'plains'
  } else if (0.5 < value && value <= 1) {
    return 'forest'
  } else if (1 < value && value <= 2) {
    return 'hill'
  } else {
    // value > 2
    return 'mountain'
  }
}

/**
 * Generate random terrain object at a specific 2d coordinate.
 *
 * @param {number} x coordinate
 * @param {number} y coordinate
 *
 * @return {object} terrain
 */
export const create = ({x, y}) => {
  return gameObjects.terrain.create({name: name({x, y})})
}

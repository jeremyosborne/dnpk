import assert from 'assert'
import {random} from './random'

/**
 * Generate a random number x where (min <= x <= max).
 *
 * @param {number} min lower bounds, inclusive
 * @param {number} max upper bounds, inclusive
 *
 * @return {number} integer value within inclusive bounds
 */
export const randint = (min, max) => {
  assert(max > min && Number.isInteger(min) && Number.isInteger(max))
  return Math.floor(random() * (max - min + 1)) + min
}

export default randint

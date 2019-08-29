import assert from 'assert'
import {random} from './random'

/**
 * Generate a random number min <= randomint <= max.
 *
 * @param {number} min lower bounds
 * @param {number} max upper bounds
 *
 * @return {number}
 */
export default function (min, max) {
  assert(max > min && Number.isInteger(min) && Number.isInteger(max))
  return Math.round(random() * (max - min)) + min
}

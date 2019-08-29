import {randint} from './randint'

/**
 * Simulate a dice roll, where 1 is assumed to be the min.
 *
 * @param {number} max upper bounds
 *
 * @return {number}
 */
export default function (max) {
  return randint(1, max)
}

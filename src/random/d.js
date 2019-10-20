import * as gameRules from 'game-rules'
import {randint} from './randint'

/**
 * Simulate a dice roll, where 1 is assumed to be the min.
 *
 * @param {number} max upper bounds
 *
 * @return {number} value of the dice roll.
 */
export const d = (max) => {
  return randint(1, max)
}

export default d

/**
 * Simulate a standard dice roll, between 1 and the maximum standard dice
 * size declared in the game rules.
 *
 * @return {number} value of the dice roll.
 */
d.standard = () => {
  return randint(1, gameRules.get('diceStandardMax'))
}

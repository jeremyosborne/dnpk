import * as gameRules from 'game-rules'
import {randint} from 'random'

/**
 * Simulate a standard dice roll, between 1 and the maximum standard dice
 * size declared in the game rules.
 *
 * @return {number} value of the dice roll.
 */
export const standard = () => {
  return randint(1, gameRules.get('diceStandardMax'))
}

import battleDiceStandard from './battle-dice-standard-monte-carlo'
import {prompt} from 'enquirer'
import _ from 'lodash'
import randomTerrainMonteCarlo from './random-terrain-monte-carlo'
import randomWeightedArmiesMonteCarlo from './random-weighted-armies-monte-carlo'
import violenceMonteCarlo from './violence-monte-carlo'

/**
 * Provide menu of choices for a single set of monte-carlo tests.
 */
export const mainMenu = async () => {
  // Sub-menu actions, other than the obvious, want to return to this menu.
  const actions = [
    {
      message: 'battle.dice.standard() - test pseudo random values returned from the standard dice',
      next: async () => {
        await battleDiceStandard()
        return mainMenu
      }
    },
    {
      message: 'randomTerrainMonteCarlo() - test distribution of values of terrain over a given area',
      next: async () => {
        await randomTerrainMonteCarlo()
        return mainMenu
      }
    },
    {
      message: 'randomWeightedArmiesMonteCarlo() - test random army generation',
      next: async () => {
        await randomWeightedArmiesMonteCarlo()
        return mainMenu
      }
    },
    {
      message: 'violence() - simulates results of a single battle round',
      next: async () => {
        await violenceMonteCarlo()
        return mainMenu
      },
    },
    {
      message: 'Exit',
      // When used with launcher, will yield control back to main menu.
      next: () => null
    }
  ]

  const answer = await prompt({
    type: 'select',
    message: 'Monte Carlo testing',
    name: 'action',
    // Map our action objects into enquirer friendly action objects that don't
    // like functions for `value`s...
    choices: _.map(actions, ({message}, index) => ({name: _.toString(index), message})),
  })

  return _.get(actions, `${answer.action}.next`)
}

export default mainMenu

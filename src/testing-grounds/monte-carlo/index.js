import dStandard from './d-standard-monte-carlo'
import {prompt} from 'enquirer'
import _ from 'lodash'
import randintMonteCarl from './randint-monte-carlo'
import violenceMonteCarlo from './violence-monte-carlo'

export const menu = async () => {
  // Sub-menu actions, other than the obvious, want to return to this menu.
  const actions = [
    {
      message: 'd.standard() - test pseudo random values returned from the standard dice',
      next: async () => {
        await dStandard()
        return menu
      }
    },
    {
      message: 'randint() - test pseudo random values returned from core randint',
      next: async () => {
        await randintMonteCarl()
        return menu
      }
    },
    {
      message: 'violence() - simulates results of a single battle round',
      next: async () => {
        await violenceMonteCarlo()
        return menu
      },
    },
    {
      message: 'Return to main menu',
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

  // ...look up the action function from the response.
  return _.get(actions, `${answer.action}.next`)
}

export default menu

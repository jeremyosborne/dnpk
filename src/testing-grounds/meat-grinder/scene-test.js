// @flow
import hitReturnToContinue from 'hit-return-to-continue'
import {t} from 'l10n'
import _ from 'lodash'
import {prompt} from 'enquirer'
import out from 'out'
import * as scenes from './scenes'
import * as sceneNames from './scenes/scene-names'
import terrainGenerator from './terrain-generator'
import type {GameState} from './types'

/**
 * Play one scene of the meat grinder and then exit.
 */
export const sceneTest = async (): Promise<any> => {
  const choices = _.map(sceneNames, (v, k) => ({
    message: _.startCase(_.toLower(k)),
    next: async (...args) => {
      return scenes[v](...args)
    }
  }))

  const choice = await prompt({
    type: 'select',
    message: t('Which scene?'),
    name: 'action',
    // Map our action objects into enquirer friendly action objects that don't
    // like functions for `value`s...
    choices: _.map(choices, ({message}, index) => ({name: _.toString(index), message})),
  })
  // ...look up the action function from the response.
  const scene = _.get(choices, `${choice.action}.next`)

  const gameHistory: GameState = {
    // Gets incremented to one below.
    turn: 1,
    terrain: terrainGenerator(1),
  }

  const returnValue = await scene(gameHistory)
  out('Scene returned the following:', typeof returnValue === 'function' ? returnValue.toString() : returnValue)

  await hitReturnToContinue()
}

export default sceneTest
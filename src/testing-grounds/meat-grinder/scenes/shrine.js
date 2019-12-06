// @flow
import * as dataSourceGame from 'data-source-game'
import hitReturnToContinue from 'hit-return-to-continue'
import * as gameObjectsCommon from 'game-objects-common'
import _ from 'lodash'
import * as sceneChoices from './scene-choices'
import out from 'out'
import * as simulation from 'simulation'
import * as wrappers from './wrappers'

import type {
  GameState,
  NextScene,
} from '../types'

/**
 * Buff the armies within the army-group before continuing on.
 *
 * Blessings come from a particular deity, and each army may receive only one
 * blessing from a particular deity.
 *
 * @return {NextScene}
 */
export const scene = async ({terrain, turn}: GameState): NextScene => {
  const protagonist = dataSourceGame.protagonist.get()
  const armyGroup = _.get(protagonist, 'armyGroups[0]')
  const deity = simulation.randomNaming({name: 'deity'})

  // Deity official names can have some funky characters.
  out.t('You come upon the shrine of {{- deity}} surrounded by {{terrain, commonName}}. Your armies will be blessed.', {deity, terrain})
  const armies = Array.isArray(armyGroup) ? armyGroup : armyGroup.armies
  _.forEach(armies, (army) => {
    if (gameObjectsCommon.effects.blessings.has(army, deity)) {
      out.t('{{army, commonName}} already has the blessing of {{- deity}}.', {army, deity})
    } else {
      gameObjectsCommon.effects.blessings.add(army, deity)
      out.t('{{army, commonName}} receives the blessing of {{- deity}}.', {army, deity})
    }
  })

  await hitReturnToContinue()

  dataSourceGame.protagonist.save({armyGroups: [armyGroup]})

  // Time to test out that training ;)
  return sceneChoices.violent()
}

export default _.flow([
  wrappers.throwIfNoEmpire,
  wrappers.throwIfNoArmyGroup,
])(scene)

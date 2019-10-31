// @flow
import * as dataSourceGame from 'data-source-game'
import * as gameObjectsCommon from 'game-objects-common'
import _ from 'lodash'
import * as sceneNames from './scene-names'
import * as wrappers from './wrappers'

import type {NextScene} from './flow-types'

/**
 * This is assumed to be the first scene run, and other than things considered
 * game-preventing (like creating a protagonist), should allow the player
 * to ready themselves for the upcoming adventure.
 *
 * @return {NextScene}
 */
export const scene = async (): NextScene => {
  const armyGroup = dataSourceGame.protagonist.getArmyGroup()
  if (!gameObjectsCommon.armies.size(armyGroup)) {
    // Give the protagonist a fresh army-group if they don't have one...
    return sceneNames.RAISE_NEW_ARMY_GROUP
  } else {
    // ...or else it's off to battle for you.
    return sceneNames.FIGHT
  }
}

export default _.flow([
  wrappers.throwIfNoEmpire,
])(scene)

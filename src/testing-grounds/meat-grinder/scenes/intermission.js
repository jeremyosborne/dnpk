// @flow
import * as dataSourceGame from 'data-source-game'
import {prompt} from 'enquirer'
import * as gameObjectsCommon from 'game-objects-common'
import _ from 'lodash'
import {t} from 'l10n'
import * as sceneChoices from './scene-choices'
import * as wrappers from './wrappers'

import type {
  GameState,
  NextScene,
} from '../types'

/**
 * Follows every significant scene, and decides path to take based on game
 * state.
 */
export const scene = async (gameState: GameState): NextScene => {
  const {confirmed} = await prompt({
    initial: true,
    message: t('Do you wish to continue in your endless quest?'),
    name: 'confirmed',
    type: 'confirm',
  })
  if (!confirmed) {
    return null
  }

  // Give the protagonist a fresh army-group if they don't have one...
  const armyGroup = dataSourceGame.protagonist.getArmyGroup()
  if (!gameObjectsCommon.armies.size(armyGroup)) {
    return sceneChoices.defeat()
  } else {
    return sceneChoices.generalEncounter()
  }
}

export default _.flow([
  wrappers.throwIfNoEmpire,
])(scene)

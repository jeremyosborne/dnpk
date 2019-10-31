// @flow
import * as dataSourceGame from 'data-source-game'
import {prompt} from 'enquirer'
import * as gameObjectsCommon from 'game-objects-common'
import _ from 'lodash'
import {t} from 'l10n'
import * as nameIndex from './name-index'
import * as random from 'random'
import * as wrappers from './wrappers'

import type {NextScene} from './flow-types'

/**
 * Follows every significant scene, and decides path to take based on game
 * state.
 *
 * @return {NextScene}
 */
export const scene = async (): NextScene => {
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
    return nameIndex.RAISE_NEW_ARMY_GROUP
  } else {
    // If you have an army coming into the intermission, you have a slight chance
    // for an alternate, non-fight route.
    return random.sampleWeighted({
      choices: [
        nameIndex.FIGHT,
        nameIndex.SHRINE,
      ],
      weight: (name) => {
        const weights = {
          [nameIndex.FIGHT]: 7,
          [nameIndex.SHRINE]: 1,
        }
        return weights[name] || 1
      }
    })[0]
  }
}

export default _.flow([
  wrappers.throwIfNoEmpire,
])(scene)

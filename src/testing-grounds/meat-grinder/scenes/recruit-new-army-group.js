import * as dataSourceGame from 'data-source-game'
import hitReturnToContinue from 'hit-return-to-continue'
import * as gameObjectsCommon from 'game-objects-common'
import _ from 'lodash'
import out from 'out'
import * as sceneChoices from './scene-choices'
import {createRandomWeightedArmyGroup} from 'simulation'
import * as ui from 'ui'
import * as wrappers from './wrappers'

// import type {NextScene} from './flow-types'

/**
 * You will be granted a new army group if you wind up here, and should you
 * wind up here with an existing group that existing group will be replaced.
 *
 * @return {NextScene}
 */
export const scene = async () => {
  let armyGroup = dataSourceGame.protagonist.getArmyGroup()

  out('')

  if (!gameObjectsCommon.armies.size(armyGroup)) {
    out.t('It\'s dangerous to go alone. Here, take this:')
  } else {
    // Really, the game shouldn't let us get here, but if it does.
    out.t('You wave a tearful goodbye to your old group, and replace them with the following:')
  }

  out('')

  armyGroup = createRandomWeightedArmyGroup()
  ui.text.armyGroup({armyGroup})
  // For now, you only have one army group you are working with.
  dataSourceGame.protagonist.save({armyGroups: [armyGroup]})
  await hitReturnToContinue()

  return sceneChoices.violent()
}

export default _.flow([
  wrappers.throwIfNoEmpire,
])(scene)

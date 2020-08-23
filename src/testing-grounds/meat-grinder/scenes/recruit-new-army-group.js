import * as dataSourceGame from 'meat-grinder/data-source-game'
import hitReturnToContinue from 'hit-return-to-continue'
import * as gameObjectsCommon from 'game-objects-common'
import _ from 'lodash'
import out from 'out'
import * as sceneChoices from './scene-choices'
import {createRandomWeightedArmyGroup} from 'simulation'
import * as ui from 'ui'
import * as wrappers from './wrappers'

/**
 * You will be granted a new army group if you wind up here, and should you
 * wind up here with an existing group that existing group will be replaced.
 *
 * @return {NextScene}
 */
export const scene = async ({protagonist: {armyGroup}}) => {
  out('')

  if (!gameObjectsCommon.armies.size(armyGroup)) {
    out.t('It\'s dangerous to go alone. Here, take this:')
  } else {
    // Really, the game shouldn't let us get here, but if it does.
    out.t('You wave a tearful goodbye to your old group, and replace them with the following:')
  }

  out('')

  armyGroup = createRandomWeightedArmyGroup()
  ui.text.armyGroup.out(armyGroup)
  // For now, you only have one army group you are working with.
  dataSourceGame.protagonist.save({armyGroups: [armyGroup]})
  await hitReturnToContinue()

  return sceneChoices.violent()
}

export default _.flowRight([
  wrappers.throwIfNoEmpire,
  wrappers.uiWhiteSpace,
  wrappers.uiGameTurn,
  wrappers.uiTerrain,
])(scene)

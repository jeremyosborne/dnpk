// @flow
import * as dataSourceGame from 'data-source-game'
import hitReturnToContinue from 'hit-return-to-continue'
import * as gameObjectsCommon from 'game-objects-common'
import _ from 'lodash'
import * as nameIndex from './name-index'
import out from 'out'
import {createRandomWeightedArmyGroup} from 'simulation'
import * as ui from 'ui'
import * as wrappers from './wrappers'

import type {NextScene} from './flow-types'

export const scene = async (): NextScene => {
  const protagonist = dataSourceGame.protagonist.get()

  // Give the protagonist a fresh army-group if they don't have one...
  let armyGroup = _.get(protagonist, 'armyGroups[0]')
  if (!gameObjectsCommon.armies.size(armyGroup)) {
    out.t('It\'s dangerous to go alone. Here, take this:')
    armyGroup = createRandomWeightedArmyGroup()

    ui.text.armyGroup({armyGroup})
    // For now, you only have one army group you are working with.
    dataSourceGame.protagonist.save({armyGroups: [armyGroup]})
    await hitReturnToContinue()
  }
  // ...else just continue on to the first fight.

  return nameIndex.FIGHT
}

export default _.flow([
  wrappers.throwIfNoEmpire,
])(scene)

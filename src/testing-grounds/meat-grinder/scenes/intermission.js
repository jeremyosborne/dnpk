// @flow
import * as dataSourceGame from 'data-source-game'
import {prompt} from 'enquirer'
import hitReturnToContinue from 'hit-return-to-continue'
import * as gameObjectsCommon from 'game-objects-common'
import _ from 'lodash'
import {t} from 'l10n'
import * as nameIndex from './name-index'
import out from 'out'
import * as random from 'random'
import {createRandomWeightedArmyGroup} from 'simulation'
import * as ui from 'ui'
import * as wrappers from './wrappers'

import type {NextScene} from './flow-types'

export const scene = async (): NextScene => {
  const protagonist = dataSourceGame.protagonist.get()

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
  let armyGroup = _.get(protagonist, 'armyGroups[0]')
  if (!gameObjectsCommon.armies.size(armyGroup)) {
    out.t('It\'s dangerous to go alone. Here, take this:')
    armyGroup = createRandomWeightedArmyGroup()

    ui.text.armyGroup({armyGroup})
    // For now, you only have one army group you are working with.
    dataSourceGame.protagonist.save({armyGroups: [armyGroup]})
    await hitReturnToContinue()
    return nameIndex.FIGHT
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

import * as dataSourceGame from 'data-source-game'
import {prompt} from 'enquirer'
import hitReturnToContinue from 'hit-return-to-continue'
import * as gameObjectsCommon from 'game-objects-common'
import _ from 'lodash'
import {t} from 'l10n'
import * as nameIndex from './name-index'
import out from 'out'
import {createRandomWeightedArmyGroup} from 'simulation'
import * as ui from 'ui'

export const scene = async () => {
  const protagonist = dataSourceGame.protagonist.get()
  // We (still) assume protagonist creation happens outside of the meat-grinder.

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
  }
  // ...else just continue on to the first fight.

  return nameIndex.FIGHT
}

export default scene

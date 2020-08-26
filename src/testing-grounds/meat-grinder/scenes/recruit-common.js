import * as dataSourceGame from 'meat-grinder/data-source-game'
import hitReturnToContinue from 'hit-return-to-continue'
import * as gameObjectsCommon from 'game-objects-common'
import _ from 'lodash'
import out from 'out'
import * as sceneChoices from './scene-choices'
import * as ui from 'ui'
import * as wrappers from './wrappers'

/**
 * Generate a recruit scenario.
 *
 * Takes a createArmies function that takes {armyGroup} object and returns
 * {armies: Array<army>, messages?: {prelude?}}.
 */
export const createScene = ({createArmies}) => _.flowRight([
  wrappers.throwIfNoEmpire,
  wrappers.uiWhiteSpace,
  wrappers.uiGameTurn,
  wrappers.uiTerrain,
])(async ({protagonist: {armyGroup}, terrain, turn}) => {
  const {armies, messages = {prelude: ''}} = createArmies({armyGroup})

  if (!_.isEmpty(armies)) {
    if (messages.prelude) {
      out(messages.prelude)
    } else {
      // Default message.
      out.t('{{armies}} is training here.', {armies: ui.text.naming.short(armies), count: armies.length})
      out.t('They join your ranks, eager to bring glory to your empire.')
    }

    // Add the new armies to the army group.
    _.forEach(armies, (army) => gameObjectsCommon.armies.add(armyGroup, army))
    armyGroup = gameObjectsCommon.armies.sort(armyGroup)
    // Continuing assumption you can only have one army group in the meat grinder.
    dataSourceGame.protagonist.set({armyGroups: [armyGroup]})

    await hitReturnToContinue()

    // Give a violent next stop.
    return sceneChoices.violent()
  } else {
    // Head back to the intermission for another shot after a short message about
    // coming upon a clearing with nothing there.
    out.t("It is peaceful here. After a moment's rest, you move on.")
    await hitReturnToContinue()
    return sceneChoices.intermission()
  }
})

import * as gameObjects from 'game-objects'
import * as gameObjectsCommon from 'game-objects-common'
import hitReturnToContinue from 'hit-return-to-continue'
import _ from 'lodash'
import * as dataSourceGame from 'meat-grinder/data-source-game'
import out from 'out'
import * as sceneChoices from './scene-choices'
import * as simulation from 'simulation'
import * as ui from 'ui'
import * as wrappers from './wrappers'

/**
 * You will be granted a new army group if you wind up here, and should you
 * wind up here with an existing group that existing group will be replaced.
 *
 * @return {NextScene}
 */
export const scene = async ({protagonist: {armyGroup = gameObjects.armyGroup.create()}}) => {
  const armiesSize = gameObjectsCommon.armies.size(armyGroup)

  if (!armiesSize) {
    const size = 8
    // Build a basic army, but no heroes.
    const exclude = _.filter(gameObjects.army.def(), (aDef) => {
      if (
        gameObjectsCommon.is.hero(aDef)
      ) {
        return true
      } else {
        return false
      }
    }).map((aDef) => aDef.name)
    const armies = simulation.createRandomWeightedArmies({exclude, size})

    out.t('It\'s dangerous to go alone. Here, take this: {{armies}}', {armies: ui.text.naming.short(armies), count: armies.length})

    // Add the new armies to the army group.
    _.forEach(armies, (army) => gameObjectsCommon.armies.add(armyGroup, army))
    armyGroup = gameObjectsCommon.armies.sort(armyGroup)
    // Continuing assumption you can only have one army group in the meat grinder.
    dataSourceGame.protagonist.save({armyGroups: [armyGroup]})

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
}

export default _.flowRight([
  wrappers.throwIfNoEmpire,
  wrappers.uiWhiteSpace,
  wrappers.uiGameTurn,
  wrappers.uiTerrain,
])(scene)

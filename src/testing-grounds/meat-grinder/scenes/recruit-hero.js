import * as dataSourceGame from 'meat-grinder/data-source-game'
import hitReturnToContinue from 'hit-return-to-continue'
import * as gameObjects from 'game-objects'
import * as gameObjectsCommon from 'game-objects-common'
import * as gameRules from 'game-rules'
import _ from 'lodash'
import out from 'out'
import * as random from 'random'
import * as sceneChoices from './scene-choices'
import * as simulation from 'simulation'
import * as ui from 'ui'
import * as wrappers from './wrappers'

/**
 * You will potentially be granted a new hero, based on the number of heroes
 * you already have.
 *
 * @return {NextScene}
 */
export const scene = async ({protagonist: {armyGroup = gameObjects.armyGroup.create()}, terrain, turn}) => {
  const heroes = _.filter(gameObjectsCommon.armies.get(armyGroup), (army) => gameObjectsCommon.effects.hasName(army, 'hero'))

  const canHazHero = heroes.length === 0
    ? true
    : heroes.length < gameRules.get('heroesMax')
      ? random.randint(1, heroes.length * 2) === 1
      : false

  if (canHazHero) {
    const size = 1
    const exclude = _.filter(gameObjects.army.def(), (aDef) => {
      if (!gameObjectsCommon.effects.hasName(aDef, 'hero')) {
        return true
      } else {
        return false
      }
    }).map((aDef) => aDef.name)
    const armies = simulation.createRandomWeightedArmies({exclude, size})

    out.t('{{armies}} is training here.', {armies: ui.text.naming.short(armies)})
    out.t('They join your ranks, eager to bring glory to your empire.')

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

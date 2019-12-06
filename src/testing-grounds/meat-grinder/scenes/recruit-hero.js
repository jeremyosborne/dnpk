// @flow
import * as dataSourceGame from 'data-source-game'
import hitReturnToContinue from 'hit-return-to-continue'
import * as gameObjects from 'game-objects'
import * as gameObjectsCommon from 'game-objects-common'
import * as gameRules from 'game-rules'
import _ from 'lodash'
import out from 'out'
import * as random from 'random'
import * as sceneChoices from './scene-choices'
import * as simulation from 'simulation'
import terrainGenerator from './terrain-generator'
// import * as ui from 'ui'
import * as wrappers from './wrappers'

import type {
  GameState,
  NextScene,
} from './flow-types'

/**
 * You will potentially be granted a new hero, based on the number of heroes
 * you already have.
 *
 * @return {NextScene}
 */
export const scene = async ({turn}: GameState): NextScene => {
  let armyGroup = dataSourceGame.protagonist.getArmyGroup()
  const heroes = _.filter(gameObjectsCommon.armies.get(armyGroup), (army) => gameObjectsCommon.effects.hasName(army, 'hero'))

  const canHazHero = heroes.length === 0
    ? true
    : heroes.length < gameRules.get('heroesMax')
      ? random.randint(1, heroes.length * 2) === 1
      : false

  const terrain = terrainGenerator(turn)

  if (canHazHero) {
    // Create a hero and add to the army group.
    const army = gameObjects.army.create({name: 'hero'})
    // Give a name to the hero.
    army.nameInstance = simulation.randomNaming({name: 'hero'})
    gameObjectsCommon.armies.add(armyGroup, army)
    armyGroup = gameObjectsCommon.armies.sort(armyGroup)
    // For now, you only have one army group you are working with.
    dataSourceGame.protagonist.save({armyGroups: [armyGroup]})

    out.t('You come upon {{terrain, commonName}} where {{army, commonName}} is training.', {army, terrain})
    out.t('{{army, commonName}} joins your ranks, eager to bring glory to your empire.', {army})
    await hitReturnToContinue()

    // Give a violent next stop.
    return sceneChoices.violent()
  } else {
    // Head back to the intermission for another shot after a short message about
    // coming upon a clearing with nothing there.
    out.t('You come upon {{terrain, commonName}}. It is peaceful. After a moments rest, you move on.', {terrain})
    await hitReturnToContinue()
    return sceneChoices.intermission()
  }
}

export default _.flow([
  wrappers.throwIfNoEmpire,
  wrappers.throwIfNoArmyGroup,
])(scene)

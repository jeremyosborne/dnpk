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
// import * as ui from 'ui'
import * as wrappers from './wrappers'

import type {
  GameState,
  NextScene,
} from '../types'

/**
 * New units may join you.
 */
export const scene = async ({terrain, turn}: GameState): NextScene => {
  let armyGroup = dataSourceGame.protagonist.getArmyGroup()
  const armiesSize = gameObjectsCommon.armies.size(armyGroup)

  // If your meat grinder army has less armies than the rules allow, then you
  // can get more armies. If you have more, than you can still get more, but
  // the chance of getting them is less.
  const canHazArmies = armiesSize < gameRules.get('armyGroupSizeMax')
    ? true
    : random.randint(1, armiesSize * 3) < gameRules.get('armyGroupSizeMax')

  if (canHazArmies) {
    const canHazHowManyArmies = armiesSize < gameRules.get('armyGroupSizeMax')
      // If you have less than the max, than you can potentially refill your armyGroup...
      ? random.randint(1, gameRules.get('armyGroupSizeMax') - armiesSize)
      // ...otherwise you can have at most 2.
      : random.randint(1, 2)

    // Create a small set of non-special armies, and add to the army group.
    const armyNames = simulation.randomWeightedArmies({
      // Hard coded to non-aerial, non-elite armies. This should be managed by
      // a function.
      exclude: [
        'demon',
        'devil',
        'dragon',
        'griffin',
        'hero',
        'pegasus',
        'undead',
        'wizard',
      ],
      size: canHazHowManyArmies,
    })
    out.t('Your travels carry you to a {{terrain, commonName}}', {terrain})
    // Plurals handled in the en/translation.json.
    out.t('where {{armies, commonName}} is training.', {armies: armyNames, count: armyNames.length})
    out.t('They join your ranks, eager to bring glory to your empire.')

    // Add the new armies to the army group.
    _.forEach(armyNames, (name) => {
      const army = gameObjects.army.create({name})
      gameObjectsCommon.armies.add(armyGroup, army)
    })
    armyGroup = gameObjectsCommon.armies.sort(armyGroup)
    // Continuing assumption you can only have one army group in the meat grinder.
    dataSourceGame.protagonist.save({armyGroups: [armyGroup]})

    await hitReturnToContinue()

    // Give a violent next stop.
    return sceneChoices.violent()
  } else {
    // Head back to the intermission for another shot after a short message about
    // coming upon a clearing with nothing there.
    out.t('You come upon {{terrain, commonName}}. It is peaceful. After a moment\'s rest, you move on.', {terrain})
    await hitReturnToContinue()
    return sceneChoices.intermission()
  }
}

export default _.flow([
  wrappers.throwIfNoEmpire,
  wrappers.throwIfNoArmyGroup,
])(scene)

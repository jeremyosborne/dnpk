import * as gameObjects from 'game-objects'
import * as gameObjectsCommon from 'game-objects-common'
import * as gameRules from 'game-rules'
import _ from 'lodash'
import * as random from 'random'
import {createScene} from './recruit-common'
import * as simulation from 'simulation'

export const createArmies = ({armyGroup}) => {
  let armies = []
  const messages = {
    prelude: ''
  }
  const armiesSize = gameObjectsCommon.armies.size(armyGroup)

  // If your meat grinder army has less armies than the rules allow, then you
  // can get more armies. If you have more, than you can still get more, but
  // the chance of getting them is less.
  const canHazArmies = armiesSize < gameRules.get('armyGroupSizeMax')
    ? true
    : random.randint(1, armiesSize * 3) < gameRules.get('armyGroupSizeMax')

  if (canHazArmies) {
    const size = armiesSize < gameRules.get('armyGroupSizeMax')
      // If you have less than the max, than you can potentially refill your armyGroup...
      ? random.randint(1, gameRules.get('armyGroupSizeMax') - armiesSize)
      // ...otherwise you can have at most 2.
      : random.randint(1, 2)

    // Create a small set of non-special armies (by excluding special armies),
    // and add to the army group.
    const exclude = _.filter(gameObjects.army.def(), (aDef) => {
      if (
        gameObjectsCommon.effects.hasName(aDef, 'aerial') ||
        gameObjectsCommon.effects.hasName(aDef, 'elite') ||
        gameObjectsCommon.is.hero(aDef)
      ) {
        return true
      } else {
        return false
      }
    }).map((aDef) => aDef.name)
    armies = simulation.createRandomWeightedArmyGroup({exclude, size}).armies
    // Use the default message.
  }

  return {
    armies,
    messages,
  }
}

/**
 * New units may join you.
 */
export const scene = createScene({createArmies})

export default scene

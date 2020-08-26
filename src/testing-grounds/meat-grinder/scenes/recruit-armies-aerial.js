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
  const canHazAerial = armiesSize < gameRules.get('armyGroupSizeMax')
    ? true
    : random.randint(1, armiesSize * 6) < gameRules.get('armyGroupSizeMax')

  if (canHazAerial) {
    const size = armiesSize < gameRules.get('armyGroupSizeMax')
      // If you have less than the max, than you'll get maybe...
      ? random.randint(1, 3)
      // ...otherwise you'll get
      : 1

    const exclude = _.filter(gameObjects.army.def(), (aDef) => {
      if (!gameObjectsCommon.effects.hasName(aDef, 'aerial')) {
        return true
      } else {
        return false
      }
    }).map((aDef) => aDef.name)
    armies = simulation.createRandomWeightedArmies({exclude, size})
    // Use the default message.
  }

  return {
    armies,
    messages,
  }
}

/**
 * Find aerial units.
 */
export const scene = createScene({createArmies})

export default scene

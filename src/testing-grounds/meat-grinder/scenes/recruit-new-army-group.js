import * as gameObjects from 'game-objects'
import * as gameObjectsCommon from 'game-objects-common'
import {t} from 'l10n'
import _ from 'lodash'
import {createScene} from './recruit-common'
import * as simulation from 'simulation'
import * as ui from 'ui'

export const createArmies = ({armyGroup}) => {
  let armies = []
  const messages = {
    prelude: ''
  }
  const armiesSize = gameObjectsCommon.armies.size(armyGroup)

  if (!armiesSize) {
    const size = 8
    // Build a potentially strong army, but no heroes.
    const exclude = _.filter(gameObjects.army.def(), (aDef) => {
      if (
        gameObjectsCommon.is.hero(aDef)
      ) {
        return true
      } else {
        return false
      }
    }).map((aDef) => aDef.name)
    armies = simulation.createRandomWeightedArmies({exclude, size})
    messages.prelude = t('It\'s dangerous to go alone. Here, take this: {{armies}}', {armies: ui.text.naming.short(armies), count: armies.length})
  }

  return {
    armies,
    messages,
  }
}

/**
 * You will be granted a new army group if you wind up here, and should you
 * wind up here with an existing group that existing group will be replaced.
 */
export const scene = createScene({createArmies})

export default scene

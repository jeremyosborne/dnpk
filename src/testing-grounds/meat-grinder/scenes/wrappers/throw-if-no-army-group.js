import * as dataSourceGame from 'meat-grinder/data-source-game'
import * as gameObjectsCommon from 'game-objects-common'
import _ from 'lodash'

export const throwIfNoArmyGroup = (f) => {
  return async (...args) => {
    const protagonist = dataSourceGame.protagonist.get()
    // Give the protagonist a fresh army-group if they don't have one...
    const armyGroup = _.get(protagonist, 'armyGroups[0]')
    if (!gameObjectsCommon.armies.size(armyGroup)) {
      throw new Error('Error: entering a scene without an army group.')
    }

    return f(...args)
  }
}

export default throwIfNoArmyGroup

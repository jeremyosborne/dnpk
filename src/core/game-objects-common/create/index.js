import * as gameObjects from 'game-objects'
import _ from 'lodash'

/**
 * Factory method for calling `create` through the game-objects-common module.
 *
 * No frills, plain object returned. Saves an import. Assumes type exists as valid
 * game-object that implements `create`.
 */
export const create = (
  // 'army', 'empire', etc.
  type,
  // Remaining arguments passed on as is.
  {name, ...toMerge}
) => {
  const entity = gameObjects[type].create({name})
  return _.merge(entity, toMerge)
}

export default create

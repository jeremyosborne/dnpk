import * as gameObjects from 'game-objects'

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
  ...args
) => {
  return gameObjects[type].create(...args)
}

export default create

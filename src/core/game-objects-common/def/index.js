import * as gameObjects from 'game-objects'

/**
 * Factory method for calling `def` through the game-objects-common module.
 *
 * Saves an import. Assumes type exists as valid game-object that implements `def`.
 */
export const def = (
  // 'army', 'empire', etc.
  type,
  // Remaining arguments passed on as is.
  ...args
) => {
  return gameObjects[type].def(...args)
}

export default def

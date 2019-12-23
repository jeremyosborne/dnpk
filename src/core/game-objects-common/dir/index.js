import * as gameObjects from 'game-objects'

/**
 * Factory method for calling `dir` through the game-objects-common module.
 *
 * Saves an import. Assumes type exists as valid game-object that implements `dir`.
 */
export const dir = (
  // 'army', 'empire', etc.
  type
) => {
  return gameObjects[type].dir()
}

export default dir

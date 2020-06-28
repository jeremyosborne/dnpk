import out from 'out'

//
// Wraps a scene.
//
// Adds white space between the previous scene and this one. Cosmetic.
//
export const uiWhiteSpace = (scene) => {
  return async (gameState) => {
    out('')
    return scene(gameState)
  }
}

export default uiWhiteSpace

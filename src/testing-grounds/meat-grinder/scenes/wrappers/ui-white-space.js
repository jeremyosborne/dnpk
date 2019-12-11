import out from 'out'

import type {GameState} from '../../types'

//
// Wraps a scene.
//
// Adds white space between the previous scene and this one. Cosmetic.
//
export const uiWhiteSpace = (f: (gameState: GameState) => any) => {
  return async (gameState: GameState) => {
    out('')
    return f(gameState)
  }
}

export default uiWhiteSpace

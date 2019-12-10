import out from 'out'

import type {GameState} from '../../types'

//
// Wraps a scene.
//
// If turn is passed in as part of the game state, display the game turn.
//
export const uiGameTurn = (f: (gameState: GameState) => any) => {
  return async (gameState: GameState) => {
    const {turn} = gameState
    if (turn) {
      out.t('Turn #{{turn}}.', {turn})
    }
    // ... continue on.
    return f(gameState)
  }
}

export default uiGameTurn

import out from 'out'

//
// Wraps a scene.
//
// If turn is passed in as part of the game state, display the game turn.
//
export const uiGameTurn = (scene) => {
  return async (gameState) => {
    const {turn} = gameState
    if (turn) {
      out.t('Turn #{{turn}}.', {turn})
    }
    // ... continue on.
    return scene(gameState)
  }
}

export default uiGameTurn

import out from 'out'

import type {GameState} from '../../types'

//
// Wraps a scene.
//
// If terrain is passed in as part of the game state, display the terrain.
//
export const uiTerrain = (f: (gameState: GameState) => any) => {
  return async (gameState: GameState) => {
    const {terrain} = gameState
    if (terrain) {
      out.t('Your endless travels take you to a {{terrain, commonName}}.', {terrain})
    }
    // ... continue on.
    return f(gameState)
  }
}

export default uiTerrain

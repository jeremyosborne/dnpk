import out from 'out'

import type {GameState} from '../../types'

//
// Wraps a scene.
//
// If terrain is passed in as part of the game state, display the terrain.
//
export const endlessTravelsPreamble = (f: (gameState: GameState) => any) => {
  return async (gameState: GameState) => {
    const {terrain} = gameState
    if (gameState.terrain) {
      out.t('Your endless travels take you to a {{terrain, commonName}}.', {terrain})
    }
    // ... continue on.
    return f(gameState)
  }
}

export default endlessTravelsPreamble

import out from 'out'
import * as ui from 'ui'

//
// Wraps a scene.
//
// If terrain is passed in as part of the game state, display the terrain.
//
export const uiTerrain = (scene) => {
  return async (gameState) => {
    const {terrain} = gameState
    if (terrain) {
      out.t('Your endless travels take you to a {{terrain}}.', {terrain: ui.text.naming.short.string(terrain)})
    }
    // ... continue on.
    return scene(gameState)
  }
}

export default uiTerrain

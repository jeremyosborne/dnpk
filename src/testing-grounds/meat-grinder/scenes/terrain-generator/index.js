import * as gameObjects from 'game-objects'
import * as simulation from 'simulation'

// For the meat-grinder, we don't (yet) deal with mountains or water.
// If these get generated, turn them into good enough equivalents.
const blacklistRemap = {
  water: 'shore',
  mountain: 'hill',
}

export const terrainGenerator = (x, y = 0) => {
  let name = simulation.randomTerrain.name({x, y})
  if (blacklistRemap[name]) {
    name = blacklistRemap[name]
  }
  return gameObjects.terrain.create({name})
}

export default terrainGenerator

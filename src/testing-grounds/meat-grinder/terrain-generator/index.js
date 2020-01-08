import * as gameObjects from 'game-objects'
import * as simulation from 'simulation'

// For the meat-grinder, we don't (yet) deal with mountains or water.
// If these get generated, turn them into good enough equivalents.
const blacklistRemap = {
  water: 'shore',
  mountain: 'hill',
}

export const terrainGenerator = (x, y = 0) => {
  const terrain = simulation.randomTerrain.create({x, y})
  if (blacklistRemap[terrain.name]) {
    // If the name is in the blacklist, recreate the terrain object and return.
    return gameObjects.terrain.create({name: blacklistRemap[terrain.name]})
  }
  return terrain
}

export default terrainGenerator

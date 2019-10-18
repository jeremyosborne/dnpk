import * as dataSourceGameObjects from 'data-source-game-objects'

/**
 * Return a new terrain instance.
 *
 * @param {string} name of the terrain to create.
 *
 * @return {object} new terrain instance.
 */
export const create = ({name}) => {
  const terrain = dataSourceGameObjects.create({name, type: 'terrain'})

  // TODO: Terrain should get coordinates as an id?

  // Not planning on using documentation in game... for now.
  delete terrain.documentation

  return terrain
}

export default create

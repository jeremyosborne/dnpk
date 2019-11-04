import * as dataSourceModdables from 'data-source-moddables'

/**
 * Return a new terrain instance.
 *
 * @param {string} name of the terrain to create.
 *
 * @return {object} new terrain instance.
 */
export const create = ({name}) => {
  const terrain = dataSourceModdables.create({name, type: 'terrain'})

  // TODO: Terrain should get coordinates as an id?

  // Not planning on using documentation in game... for now.
  delete terrain.documentation

  return terrain
}

export default create

import * as dataSourceModdables from 'data-source-moddables'

/**
 * Return a new structure instance.
 *
 * @param {string} name of the structure to create.
 *
 * @return {object} new structure instance.
 */
export const create = ({name}) => {
  const terrain = dataSourceModdables.create({name, type: 'structure'})

  // Not planning on using documentation in game... for now.
  delete terrain.documentation

  return terrain
}

export default create

import * as dataSourceModdables from 'data-source-moddables'
import uuid from 'uuid/v1'

/**
 * Return a new entity instance.
 *
 * @param {string} name of the specific entity to create.
 *
 * @return {object} new entity instance.
 */
export const create = ({name}) => {
  const entity = dataSourceModdables.create({name, type: 'cosmetic'})

  entity.createdAt = new Date().toISOString()

  // Not planning on using documentation in game... for now.
  delete entity.documentation

  // All objects get a unique id.
  entity.id = uuid()

  return entity
}

export default create

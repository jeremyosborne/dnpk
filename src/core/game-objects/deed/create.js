import {TYPE} from './constants'
import * as dataSourceModdables from 'data-source-moddables'
import {v1 as uuid} from 'uuid'

/**
 * Return a new entity instance.
 *
 * @param {string} name of the specific entity to create.
 *
 * @return {object} new entity instance.
 */
export const create = ({name}) => {
  const entity = dataSourceModdables.create({name, type: TYPE})

  // Not planning on using documentation in game... for now.
  delete entity.documentation

  // All objects get a unique id.
  entity.id = uuid()

  entity.metadata.createdAt = new Date().toISOString()

  return entity
}

export default create

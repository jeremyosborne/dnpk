import * as dataSourceModdables from 'data-source-moddables'
import uuid from 'uuid/v1'

/**
 * Return a new empire instance.
 *
 * @param {string} name of the empire to create.
 *
 * @return {object} new empire instance.
 */
export const create = ({name}) => {
  const empire = dataSourceModdables.create({name, type: 'empire'})

  // All objects get a unique id.
  empire.id = uuid()

  // Not planning on using documentation in game... for now.
  delete empire.documentation

  return empire
}

export default create

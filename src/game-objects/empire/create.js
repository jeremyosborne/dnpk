import * as dataSourceGameObjects from 'data-source-game-objects'
import dir from './dir'
import _ from 'lodash'
import uuid from 'uuid/v1'

/**
 * Return a new empire instance.
 *
 * @param {string} name of the empire to create.
 *
 * @return {object} new empire instance.
 */
export const create = ({name}) => {
  const empire = dataSourceGameObjects.create({name, type: 'empire'})

  // All objects get a unique id.
  empire.id = uuid()

  // Not planning on using documentation in game... for now.
  delete empire.documentation

  return empire
}

export default create

/**
 * Create a random empire picked from the currently available list of valid entities.
 *
 * @return {object} new empire instance.
 *
 * @throw {Error} if there appear to be no empires loaded.
 */
create.random = () => {
  const name = _.sample(dir())
  if (!name) {
    throw new Error('empire.create.random: no empire names available. Did you load the empire before calling this method?')
  }

  return create({name})
}

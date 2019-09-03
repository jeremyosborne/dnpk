import * as configGameObjects from 'config-game-objects'
import dir from './dir'
import _ from 'lodash'

/**
 * Return a new terrain instance.
 *
 * @param {string} name of the terrain to create.
 *
 * @return {object} new terrain instance.
 */
export const create = ({name}) => {
  const terrain = configGameObjects.create({name, type: 'terrain'})

  // TODO: Terrain should get coordinates as an id?

  // Not planning on using documentation in game... for now.
  delete terrain.documentation

  return terrain
}

export default create

/**
 * Create a random terrain picked from the currently available list of valid entities.
 *
 * @return {object} new terrain instance.
 *
 * @throw {Error} if there appear to be no terrain loaded.
 */
create.random = () => {
  const name = _.sample(dir())
  if (!name) {
    throw new Error('terrain.create.random: no terrain names available. Did you load the terrain before calling this method?')
  }

  return create({name})
}

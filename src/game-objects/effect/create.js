import * as configGameObjects from 'config-game-objects'
import dir from './dir'
import _ from 'lodash'
import uuid from 'uuid/v1'

/**
 * Return a new effect instance.
 *
 * @param {string} name of the army to create.
 *
 * @return {object} new army instance.
 */
export const create = ({name}) => {
  const effect = configGameObjects.create({name, type: 'effect'})

  // All objects get a unique id.
  effect.id = uuid()

  // Not planning on using documentation in game... for now.
  delete effect.documentation

  return effect
}

export default create

/**
 * Create a random effect picked from the currently available list of valid effects.
 *
 * @return {object} new effect instance.
 *
 * @throw {Error} if there appear to be no effects loaded.
 */
create.random = () => {
  const name = _.sample(dir())
  if (!name) {
    throw new Error('effect.create.random: no effect names available. Did you load the effects before calling this method?')
  }

  return create({name})
}

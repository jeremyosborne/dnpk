import * as gameObjects from 'game-objects'
import _ from 'lodash'

/**
 * Entity factory. Pass in a type and a name and get back an object. Equivalent
 * to `game-objects.*.create()` which is used under the hood.
 *
 * This method came during an attempt to dry out `game-objects.*.create.random()`
 * methods that had been copy-pasted into every `game-objects` submodule.
 *
 * @param {object} args
 * @param {object} [args.exclude] keys with truthy values will be excluded from the
 * potential set from which we sample.
 * @param {string} args.type what basic object to create: army, terrain, etc.
 *
 * @param {object} config
 * @param {string[]} config.typeBlacklist which `game-object`s don't conform to the
 * usual "create an entity instance for use in the game."
 *
 * @return {object} new empire instance.
 * @throw {Error} if there appear to be no empires loaded.
 */
export const createRandom = ({
  exclude = {},
  type,
}, {
  typeBlacklist = [
    'armyGroup',
    'common',
    'rules',
  ],
} = {}) => {
  const typeModule = _.includes(typeBlacklist, type) ? null : gameObjects[type]
  if (!typeModule) {
    throw new Error(`createRandom: cannot be used for type ${type}.`)
  }

  const names = _.filter(typeModule.dir(), (name) => !exclude[name])
  if (!names.length) {
    throw new Error('createRandom: no empire names available. Did you load the objects before calling this method, or did you exclude too many?')
  }

  const name = _.sample(names)

  return typeModule.create({name})
}

export default createRandom

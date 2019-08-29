//
// config-game-objects Public API
//

import army from './army'
import debug from 'debug'
import effect from './effect'
import equippable from './equippable'
import _ from 'lodash'
import path from 'path'
import schema from './schema'

const MODULE_DIR = path.resolve(__dirname)
const MODULE_NAME = path.basename(MODULE_DIR)
const logger = debug(`dnpk/${MODULE_NAME}`)

logger('This module assumes an async call to provided `.load()` method before running the game.')

// Associative array of types to allow more human friendly dynamic reference.
export const types = {
  army,
  effect,
  equippable,
}

/**
 * Build the prototype of a particular type.
 *
 * @param {string} name the unique name of the object, equivalent to the `name`
 * field of the definition.
 * @param {string} type the category of the type: `army`, `effect`, etc.
 *
 * @return {object} provide a ready to go copy of the basic type, from which in
 * game objects can modify and operate on freely.
 *
 * @throw {Error} if base config definitions are bad or game attempts to create
 * an object that has no definition.
 */
export const create = ({name, type}) => {
  const baseInstance = _.cloneDeep(types[type].get(name))
  if (!baseInstance) {
    throw new Error(`Requesting non existent name ${name} of type ${type}`)
  }

  // Validate and set defaults. If all things are good, we can return the validated
  // object.
  const {valid, errors, object} = schema.validate({object: baseInstance, type})
  if (!valid) {
    throw new Error(`No invalid types allowed: type: ${type}, name: ${name}, errors: ${errors}`)
  }
  return object
}

/**
 * Return a list of the `name`s of the object definitions we have loaded for
 * a particular `type`.
 *
 * @param {string} type the base type, like `army` or `effect`.
 *
 * @return {string[]}
 */
export const dir = (type) => types[type].dir()

/**
 * Load schemas and types into memory.
 *
 * Due to the importance and necessity of this module, this is required for
 * proper operation and is assumed to be performed on app startup.
 *
 * @param {boolean} force if set to true, will ignore cache and reload.
 *
 * @return {Promise} resolves on successful load rejects on any load failures.
 */
export const load = async function ({force = false} = {}) {
  // Schemas shouldn't actually need to be loaded first.
  await schema.load({force})
  await types.army.load({force})
  await types.effect.load({force})
  await types.equippable.load({force})
}

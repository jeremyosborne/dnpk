//
// config-game-objects Public API
//

import army from './army'
import debug from 'debug'
import effect from './effect'
import equippable from './equippable'
import empire from './empire'
import rules from './rules'
import _ from 'lodash'
import naming from './naming'
import path from 'path'
import schema from './schema'
import terrain from './terrain'

const MODULE_NAME = path.basename(path.resolve(__dirname))
const logger = debug(`dnpk/${MODULE_NAME}`)

logger('This module assumes an async call to provided `.load()` method before running the game.')

// Associative array of types to allow more human friendly dynamic reference.
export const types = {
  army,
  effect,
  empire,
  equippable,
  naming,
  rules,
  terrain,
}

/**
 * Clear all type caches.
 */
export const clear = () => _.forIn(types, (t) => t.clear())

/**
 * Build the prototype of a particular type.
 *
 * @param {object} args as dictionary
 * @param {string} args.name the unique name of the object, equivalent to the `name`
 * field of the definition.
 * @param {string} args.type the category of the type: `army`, `effect`, etc.
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
    // The following is only reachable in the case where the on disk file is
    // invalid. At the time of writing we are not (yet) doing DI for data sources
    // and so this code is hard to test. This comment is the reason for why
    // this remains uncovered.
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
 * @param {object} args as associative array. Meant to mirror what is passable
 * to the `load` function.
 *
 * @return {Promise} resolves on successful load rejects on any load failures.
 */
export const load = async function (args) {
  // Load schemas first so we don't ever have to think about load order when
  // validating relationship references between different type definitions.
  // Shouldn't be necessary at the time of writing, but one thing less to think
  // about later.
  await schema.load(args)
  await Promise.all(_.keys(types).map((t) => types[t].load(args)))
}

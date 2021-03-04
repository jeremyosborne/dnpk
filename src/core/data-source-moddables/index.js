//
// Public API
//

import debug from 'debug'
import _ from 'lodash'
import path from 'path'
import schema from './schema'
import {ModdableFactory} from './moddable-factory'

const MODULE_NAME = path.basename(path.resolve(__dirname))
const logger = debug(`dnpk/${MODULE_NAME}`)

logger('This module assumes an async call is made to the provided `.read()` method before running the game.')

// Associative array of type factories to allow more human friendly dynamic
// reference. These type factories do the barest of work to provide basic entities
// that the other in game wrappers can use to build in game instances.
//
// Creating new types: add the module name of the new type to the array below as
// long as the type fits in with the `type-factory-factory` way of doing things.
export const types = _.reduce([
  // Definitions of army units.
  'army',
  // Adds lively and colorful descriptions to entities.
  'cosmetic',
  // ...done dirt cheap.
  'deed',
  // The old gods and not so old gods.
  'deity',
  // Definitions of effects that can be applied to items or armies or anything else
  // that can be effected.
  'effect',
  // The in game representation of the player.
  'empire',
  // Items that can be carried by army unites.
  'equippable',
  // Groups of names.
  'naming',
  // Modifiable game rules.
  'rules',
  // Buildings, towers, defenses, places to buy units, etc.
  'structure',
  // Makes up the world and affects fighting.
  'terrain',
], (t, mod) => {
  t[mod] = new ModdableFactory({moddableName: mod})
  return t
}, {})

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
export const read = async function (args) {
  // Load schemas first so we don't ever have to think about load order when
  // validating relationship references between different type definitions.
  // Shouldn't be necessary at the time of writing, but one thing less to think
  // about later.
  await schema.read(args)
  await Promise.all(_.keys(types).map((t) => types[t].read(args)))
}

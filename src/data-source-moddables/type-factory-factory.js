const assert = require('assert')
const debug = require('debug')
const fs = require('fs').promises
const _ = require('lodash')
const path = require('path')

const logger = debug('dnpk/data-source-moddables')

/**
 * Build a type factory for in reading in the user configurable game data type
 * definitions like armies, terrain, equippables, etc.
 *
 * Import this method and call to build your factory method for the particular
 * type definitions (see existing code for examples).
 *
 * This needs a rethink before just trying to plug in the newer `io` module.
 * This was built too heavily with direct `fs` access in mind, as well as allowing
 * the files to be located wherever on disk for modding, so heavy reliance on
 * this code managing the root file path.
 *
 * @param {string} MODULE_NAME name of the module providing the factory, which
 * also equates to the `folder` containing defs.
 *
 * @return {object} returns public api for the type factory.
 */
module.exports = ({
  MODULE_NAME,
}, {
  // For an installable game, these files will get moved to the user directory.
  // For a server based game, these files will be loaded. Either way, we'll
  // eventually need to move to the `io` module, which will also mean the `io`
  // module will need to be made more flexible.
  DEFS_KEY_ROOT = path.resolve(path.resolve(__dirname), '../../data-sources/moddables')
} = {}) => {
  /**
   * This module has or has not been loaded at least one time.
   *
   * @type {boolean}
   */
  const LOADED = false

  /**
   * Cache of currently loaded types, keyed by the type `name`.
   *
   * @type {Object}
   */
  let _cache = {}

  /**
   * Resets the cache.
   */
  const clear = () => {
    _cache = {}
  }

  /**
   * Return a list of the `name`s of the object definitions we have loaded.
   *
   * @return {string[]}
   */
  const dir = () => _.keys(_cache)

  /**
   * Get a reference to a specific definition that has been loaded.
   *
   * @param {String} name the unique name of this type.
   *
   * @return {object} reference or undefined if does not exist.
   */
  const get = (name) => {
    return _cache[name]
  }

  /**
   * Loads and creates an associative array of types.
   *
   * @param {boolean} force if true, will reload items from disk even if already
   * flagged as loaded.
   *
   * @return {Promise} resolves on correct loading
   */
  const read = async function ({force = false} = {}) {
    if (LOADED && !force) {
      logger('Already loaded, call to load ignored.')
      return false
    }

    const DEFS_DIR = path.join(DEFS_KEY_ROOT, MODULE_NAME)

    // For data checking.
    const typeFiles = await fs.readdir(DEFS_DIR)

    const loading = typeFiles
      // .json files in this directory are assumed to be data defs.
      .filter((name) => /\.json$/.test(name))
      .map(async function (typeFile) {
        const typeFilePath = path.join(DEFS_DIR, typeFile)
        return {
          typeDef: JSON.parse(await fs.readFile(typeFilePath)),
          typeFilePath,
        }
      })

    return Promise.all(loading).then((typeDefs) => {
      _cache = typeDefs.reduce((typeDefs, {typeDef, typeFilePath}) => {
        logger(`${MODULE_NAME}: Reading ${typeFilePath} into set of types.`)
        // This check should be moved to an external process or script that
        // can be run independently on the data / used as a data test.
        if (typeDef.name !== /([^/]*)\.json$/.exec(typeFilePath)[1]) {
          logger(`${MODULE_NAME}: Warning: filename ${typeFilePath} out of sync with provided $id ${typeDef.name}.`)
        }
        // This is by schema definition, even though it also expressed in the file name.
        // Going to pick the data as the source of truth and not file name.
        typeDefs[typeDef.name] = typeDef
        return typeDefs
      }, {})

      // Watch for embedded data naming types that are out of sync with a file name.
      try {
        assert(typeDefs.length === dir().length)
      } catch (err) {
        throw new Error(`${MODULE_NAME}: number of files loaded must equal number of definitions keyed in our hash. You likely have a duplicate or missing 'name' property in one of your definitions.`)
      }
    })
  }

  // Public API for the type factory factory.
  return {
    clear,
    dir,
    get,
    read,
  }
}

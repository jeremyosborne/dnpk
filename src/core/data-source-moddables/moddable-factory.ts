import assert from 'assert'
import debug from 'debug'
import {promises as fs} from 'fs'
import _ from 'lodash'
import path from 'path'

/**
 * Root path for where our moddables live.
 * For an installable game, these files will get moved to the user directory.
 * For a server based game, these files will be loaded. Either way, we'll
 * eventually need to move to the `io` module, which will also mean the `io`
 * module will need to be made more flexible.
 */
export const moddablesKeyRoot = () => path.resolve(path.resolve(__dirname), '../../../data-sources/moddables')

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
 * @param {object} args
 * @param {string} args.MODULE_NAME name of the module providing the factory, which
 * also equates to the `folder` containing defs.
 *
 * @param {object} config
 * @param {string} config.KEY_ROOT the key root-path for where our moddables can
 * be located and retrieved from.
 *
 * @return {object} returns public api for the type factory.
 */
export class ModdableFactory {
  /** Cache of currently loaded types, keyed by the type `name`. */
  _cache: Record<string, unknown> = {}

  /** This module has or has not been loaded at least one time. */
  LOADED = false

  /** Name of the moddable this factory handles. */
  moddableName: string

  constructor({
    moddableName,
  }: {moddableName: string}) {
    this.moddableName = moddableName
  }

  /**
   * Resets the cache.
   */
  clear = () => {
    this._cache = {}
  }

  /**
   * Return a list of the `name`s of the object definitions we have loaded.
   *
   * @return {string[]}
   */
  dir = () => _.keys(this._cache)

  /**
   * Get a reference to a specific definition that has been loaded.
   *
   * @param {String} name the unique name of this type.
   *
   * @return {object} associative array, specific reference, or undefined if
   * name does not exist.
   */
  get = (name?: string) => {
    if (name) {
      return this._cache[name]
    } else {
      return this._cache
    }
  }

  /**
   * Loads and creates an associative array of types.
   *
   * @param {boolean} force if true, will reload items from disk even if already
   * flagged as loaded.
   *
   * @return {Promise} resolves on correct loading
   */
  read = async ({force = false} = {}) => {
    if (this.LOADED && !force) {
      logger('Already loaded, call to load ignored.')
      return false
    }

    const DEFS_DIR = path.join(moddablesKeyRoot(), this.moddableName)

    // For data checking.
    const typeFiles = await fs.readdir(DEFS_DIR)

    const loading = typeFiles
      // .json files in this directory are assumed to be data defs.
      .filter((name) => /\.json$/.test(name))
      .map(async (typeFile) => {
        const typeFilePath = path.join(DEFS_DIR, typeFile)
        return {
          typeDef: JSON.parse(await fs.readFile(typeFilePath, 'utf8')),
          typeFilePath,
        }
      })

    return Promise.all(loading).then((typeDefs) => {
      this._cache = typeDefs.reduce((_cache: Record<string, unknown>, {typeDef, typeFilePath}) => {
        logger(`${this.moddableName}: Reading ${typeFilePath} into set of types.`)
        // This check should be moved to an external process or script that
        // can be run independently on the data / used as a data test.
        if (typeDef.name !== /([^/]*)\.json$/.exec(typeFilePath)?.[1]) {
          logger(`${this.moddableName}: Warning: filename ${typeFilePath} out of sync with provided $id ${typeDef.name}.`)
        }
        // This is by schema definition, even though it also expressed in the file name.
        // Going to pick the data as the source of truth and not file name.
        _cache[typeDef.name] = typeDef
        return _cache
      }, {})

      // Watch for embedded data naming types that are out of sync with a file name.
      try {
        assert(typeDefs.length === this.dir().length)
      } catch (err) {
        throw new Error(`${this.moddableName}: number of files loaded must equal number of definitions keyed in our hash. You likely have a duplicate or missing 'name' property in one of your definitions.`)
      }
    })
  }
}

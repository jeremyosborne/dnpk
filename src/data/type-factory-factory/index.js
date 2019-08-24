const Ajv = require('ajv')
const assert = require('assert')
const {
  readdirSync,
  readFileSync,
} = require('fs')
const _ = require('lodash')
const path = require('path')
const uuid = require('uuid/v1')

const ajv = new Ajv({
  useDefaults: true
})

/**
 * Build a type factory for in game data types: armies, types, etc.
 *
 * @param {string} DEFS_DIR directory holding the type defs.
 * @param {function} logger type specific logging method
 * @param {function} postCreate a function that will be passed the instance after
 * all generic creation and, if included, must return the instance along with
 * any desired modifications.
 * @param {object} SCHEMA the JSON-Schema describing these types.
 *
 * @return {object} returns public api for the type factory.
 */
module.exports = ({
  DEFS_DIR,
  logger,
  postCreate = (instance) => instance,
  SCHEMA,
}) => {
  /**
   * Cache of currently loaded types, keyed by the type `name`.
   *
   * @type {Object}
   */
  let _cache = {}

  /**
   * Cache of loaded data definitions.
   *
   * @type {Object}
   */
  const types = {
    /**
     * List of type names currently loaded.
     *
     * @return {string[]} e.g. ['light-infantry', 'heavy-infantry', etc...]
     */
    dir: () => {
      return _.keys(_cache)
    },

    /**
     * Get reference to current associative array of types.
     *
     * @return {object}
     */
    get: () => _cache,

    /**
     * Set cached value of types, or reset to empty.
     *
     * @param {object} types update cache of types.
     */
    set: (types) => {
      _cache = types || {}
    },
  }

  /**
   * Create an instance of a specific type.
   *
   * @param {String} name the unique name of the type we wish to load.
   *
   * @return {object} instance of the particular type.
   */
  const create = (name) => {
    const instance = _.cloneDeep(types.get()[name])
    if (!instance) {
      throw new Error(`Requesting non existent type ${name}`)
    }

    // Instance specific data.
    instance.id = uuid()

    // validate and set defaults
    const validator = ajv.getSchema(SCHEMA.$id)
    const valid = validator(instance)
    if (!valid) {
      throw new Error(`No invalid types allowed. Invalid type: ${name}, validation.errors: ${validator.errors}`)
    }

    return postCreate(instance)
  }

  /**
   * Loads and creates an associative array of types.
   */
  const load = () => {
    if (!ajv.getSchema(SCHEMA.$id)) {
      ajv.addSchema(SCHEMA)
    }

    // For data checking.
    const typeFiles = readdirSync(DEFS_DIR, {withFileTypes: true})
      .map((dirent) => dirent.name)
      // .json files in this directory are assumed to be data defs.
      .filter((name) => /\.json$/.test(name))
      .map((name) => path.join(DEFS_DIR, name))

    const typeDefs = typeFiles.reduce((typeDefs, f) => {
      logger(`Reading ${f} into set of types.`)
      const typeDef = JSON.parse(readFileSync(f))
      // This is by schema definition, even though it also expressed in the file name.
      // Going to pick the data as the source of truth and not file name.
      typeDefs[typeDef.name] = typeDef
      return typeDefs
    }, {})

    types.set(typeDefs)

    // Watch for embedded data naming types that are out of sync with a file name.
    assert(typeFiles.length === types.dir().length)
  }

  // Public API for the type factory factory.
  return {
    create,
    load,
    types,
  }
}

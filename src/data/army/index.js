const debug = require('debug')
const {
  readdirSync,
  readFileSync,
} = require('fs')
const _ = require('lodash')
const path = require('path')
const schema = require('../schema')
const uuid = require('uuid/v1')

const logger = debug('dnpk/data/army')

/**
 * The schema these types are derived from.
 */
const SCHEMA_ID = `https://jeremyosborne.com/dnpk/army.schema.json`

const ARMY_DIR = path.resolve(__dirname)

/**
 * Base types of the armies.
 */
let ARMIES = {}

/**
 * Create an instance of a specific army type.
 *
 * @param {String} name the unique name of the army we wish to load.
 */
const create = (name) => {
  if (!_.keys(ARMIES).length) {
    load()
  }

  if (!schema.isLoaded()) {
    schema.load()
  }

  const army = _.cloneDeep(ARMIES[name])
  if (!army) {
    throw new Error(`Requesting non existent army type ${name}`)
  }

  // Instance specific data.
  army.id = uuid()

  const validator = schema.ajv.getSchema(SCHEMA_ID)
  // validate and set defaults
  const valid = validator(army)
  if (!valid) {
    console.error(`Army of type ${name} is invalid. Validation errors:`)
    console.error(validator.errors)
    throw new Error('No invalid army types allowed.')
  }

  return army
}

/**
 * Loads and creates an associative array of army types.
 *
 * @type {[type]}
 */
const load = () => {
  ARMIES = readdirSync(ARMY_DIR, {withFileTypes: true})
    .map((dirent) => dirent.name)
    // .json files in this directory are assumed to be data defs.
    .filter((name) => /\.json$/.test(name))
    .reduce((ARMIES, army) => {
      logger(`Reading ${army} into set of armies.`)
      const armyDef = JSON.parse(readFileSync(path.join(ARMY_DIR, army)))
      // This is by schema definition, even though it also expressed in the file name.
      // Going to pick the data as the source of truth and not file name.
      ARMIES[armyDef.name] = armyDef
      return ARMIES
    }, {})
}

// Public API.
module.exports = {
  create,
  load,
}

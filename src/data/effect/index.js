// const debug = require('debug')
const schema = require('../schema')
const uuid = require('uuid/v1')

// const logger = debug('dnpk/data/army')

/**
 * The schema these types are derived from.
 */
const SCHEMA_ID = `https://jeremyosborne.com/dnpk/effect.schema.json`

/**
 * Create an instance of a specific effect type.
 *
 * @param {String} name the unique name of the effect we wish to load.
 */
const create = (name) => {
  if (!schema.isLoaded()) {
    schema.load()
  }

  let defaultData
  try {
    // Mapping to file name is simple right now.
    defaultData = require(`./${name}.json`)
    // Instance specific data.
    defaultData.id = uuid()
  } catch (err) {
    console.error(`Could not load effect of type: ${name}. Error caught:`)
    console.error(err)
    return
  }

  const validator = schema.ajv.getSchema(SCHEMA_ID)
  // This will also set defaults.
  const valid = validator(defaultData)
  if (!valid) {
    console.error(`Effect of type ${name} is invalid. Validation errors:`)
    console.error(validator.errors)
    return
  }

  return defaultData
}

// Public API.
module.exports = {
  create,
}

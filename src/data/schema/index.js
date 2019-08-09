const Ajv = require('ajv')
const debug = require('debug')
const fs = require('fs')
const path = require('path')

const ajv = new Ajv({
  useDefaults: true
})

const logger = debug('dnpk/data/schema')

const MODULE_DIR = path.resolve(__dirname)

const MODULE_NAME = path.basename(MODULE_DIR)

logger(`Importing module ${MODULE_NAME} for the first time. This module requires a call to its \`.init()\` method before use.`)

let LOADED = false

/**
 * Call to load schemas from disk.
 *
 * Eventually allows reloading or delay of loading on module import.
 *
 * @return {boolean} false if schemas are not loaded, true if they are.
 */
const load = () => {
  if (LOADED) {
    // This needs to go if we do live reloading or directory watching.
    console.warn(`${MODULE_NAME} loaded more than once.`)
    return false
  }

  LOADED = true

  logger(`Loading schemas from: '${MODULE_DIR}'`)
  // Assuming organization is flat.
  fs.readdirSync(MODULE_DIR)
    // Don't want this or other files, like docs.
    .filter((schemaFilePath) => /.schema.json$/i.test(schemaFilePath))
    // Full path for loading.
    .map((schemaFilePath) => path.join(MODULE_DIR, schemaFilePath))
    .forEach((schemaFilePath) => {
      // AJV wants JSON objects, not plain text rom the file.
      const schema = JSON.parse(fs.readFileSync(schemaFilePath))
      logger(`Loading schema ${schemaFilePath}, with schema $id: ${schema.$id}`)
      ajv.addSchema(schema)
    })

  return true
}

/**
 * Whether or not the module has loaded at least once.
 *
 * @return {Boolean} true if loaded, false if not.
 */
const isLoaded = () => LOADED

/**
 * Generate a schema id from a unique shortname, which should match the filename (sans extension)
 * of the file containing the schema.
 *
 * @param {string} shortName like 'army' or 'effect.'
 * @return {string} the schema id, good for lookup within ajv.
 */
const schemaId = (shortName) => `https://jeremyosborne.com/dnpk/${shortName}.schema.json`

// Public API.
module.exports = {
  ajv,
  isLoaded,
  load,
  schemaId,
}

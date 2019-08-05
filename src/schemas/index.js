const Ajv = require('ajv')
const debug = require('debug')
const fs = require('fs')
const path = require('path')

const ajv = new Ajv({
  useDefaults: true
})

const logger = debug('dnpk/schemas')

const SCHEMAS_DIR = path.resolve(__dirname)

logger(`Loading schemas from: '${SCHEMAS_DIR}'`)
// Assuming organization is flat.
fs.readdirSync(SCHEMAS_DIR)
  // Don't want this or other files, like docs.
  .filter((schemaFilePath) => /.schema.json$/i.test(schemaFilePath))
  // Full path for loading.
  .map((schemaFilePath) => path.join(SCHEMAS_DIR, schemaFilePath))
  .forEach((schemaFilePath) => {
    // AJV wants JSON objects, not plain text rom the file.
    const schema = JSON.parse(fs.readFileSync(schemaFilePath))
    logger(`Loading schema ${schemaFilePath}, with schema $id: ${schema.$id}`)
    ajv.addSchema(schema)
  })

/**
 * Generate a schema id from a unique shortname, which should match the filename (sans extension)
 * of the file containing the schema.
 *
 * @param {string} shortName like 'army' or 'effect.'
 * @return {string} the schema id, good for lookup within ajv.
 */
const schemaId = (shortName) => `https://jeremyosborne.com/dnpk/${shortName}.schema.json`

module.exports = {
  // Could call it something different, but that just obscures you should be using the AJV API.
  ajv,
  // Easier than writing the entire $id, which might change.
  schemaId,
}

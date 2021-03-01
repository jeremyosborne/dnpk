import Ajv from 'ajv'
import debug from 'debug'
import {promises as fs} from 'fs'
import path from 'path'

const ajv = new Ajv({
  useDefaults: true
})

const MODULE_NAME = 'schema'
const logger = debug(`dnpk/data-source-moddables/${MODULE_NAME}`)

/**
 * This module has or has not been loaded at least one time.
 */
let LOADED = false

/**
 * Load schemas from disk.
 *
 * @return resolves with true if schemas were loaded successfully, false if schemas were 
 * intentionally not loaded, and rejects with error if something bad happened while loading.
 */
const read = async function ({force = false}: {
  /** if true, will reload items from disk even if already flagged as loaded. */
  force?: boolean
} = {}, {
  DEFS_DIR = path.resolve(path.join(__dirname, "schemas")),
  filenameRegExp = /\.schema\.json$/i,
}: {
  /** Directory containing our JSON Schema files. */
  DEFS_DIR?: string,
  /** Required file name test for our JSON schemas. Allows us to ignore other files within the `DEFS_DIR`. */
  filenameRegExp?: RegExp,
} = {}): Promise<boolean> {
  if (LOADED && !force) {
    logger('Already loaded, call to load ignored.')
    return false
  }

  LOADED = true

  logger(`Loading schemas from: '${DEFS_DIR}'`)
  try {
    // Assuming organization is flat.
    const files = await fs.readdir(DEFS_DIR)
    // Restrict loaded files.
    await Promise.all(files.filter((filename) => filenameRegExp.test(filename))
      .map(async function (filename) {
        // Full path for loading.
        const schemaFilePath = path.join(DEFS_DIR, filename)
        // AJV wants JSON objects, not plain text from the file.
        const schema = JSON.parse(await fs.readFile(schemaFilePath, {encoding: "utf8"}))
        logger(`Loading schema ${schemaFilePath}, with schema $id: ${schema.$id}`)
        // Warn on file name mismatch, although what is important is the $id.
        // TODO: This should be part of an external validation script or process.
        // if (/([^/]*)\.schema\.json$/.exec(schemaFilePath)[1] !== /([^/]*)\.schema\.json$/.exec(schema.$id)[1]) {
        //   logger(`Warning: filename ${schemaFilePath} out of sync with provided $id ${schema.$id}.`)
        // }
        ajv.addSchema(schema)
      }))
    return true
  } catch (err) {
    throw new Error(`Error reading directory containing files: DEFS_DIR ${DEFS_DIR}, error: ${err}`)
  }
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
// const schemaId = (shortName) => `https://jeremyosborne.com/dnpk/${shortName}.schema.json`
const schemaId = (shortName: string): string => shortName

/**
 * Validate an object against one of the defined types.
 *
 * Via ajv and JSON-Schema, provides a way to validate data definitions and and
 * add default values to objects.
 *
 * This method mutates the provided `object` argument. Defensive copying is
 * assumed to be done outside of this method.
 *
 * @param {object} param associative array of arguments
 * @param {object} param.object an object definition to validate and
 * @param {string} param.type a shortname of `$id` of one of the types like `army` or `effect`.
 *
 * @return {{valid, errors, object}} associative array of validation method.
 * `valid` is true if valid, false if not.
 * `errors` is null if there are no errors, or the value of the ajv `validation.errors`.
 * `object` is a reference to the object passed in, provided as a convenience even
 * though default values are applied to the passed in reference.
 */
const validate = ({object, type}: any) => {
  const validator = ajv.getSchema(schemaId(type))
  const valid = validator?.(object)
  return {valid, errors: validator?.errors, object}
}

// Public API.
export default {
  ajv,
  isLoaded,
  read,
  schemaId,
  validate,
}

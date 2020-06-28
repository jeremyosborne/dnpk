//
// Public API
//

import debug from 'debug'
import keyRoot from './key-root'
import _ from 'lodash'
import path from 'path'

const MODULE_NAME = path.basename(path.resolve(__dirname))
const logger = debug(`dnpk/${MODULE_NAME}`)

logger('This module assumes an async call to provided `.read()` method before running the game.')

// // Main argument to the l10n data source functions.
// type ResourceKey = {
//   // The language code of the resource to load.
//   lng?: string,
//   // The namespace of the resource to load.
//   ns?: string,
// }

// Translation set.
// Indexed by `[language code][namespace]`
const _cache = {}

/**
 * Return a list of the top level keys in the cache.
 */
export const dir = () => Object.keys(_cache)

/**
 * Retrieve a specific language resource, or all of them if no argument is
 * passed.
 */
export const get = (args) => {
  if (args) {
    return _.get(_cache, `${args.lng}.${args.ns}`)
  } else {
    return _cache
  }
}

/**
 * Load translations into memory.
 *
 * Due to the importance and necessity of this module, this is required for
 * proper operation and is assumed to be performed on app startup.
 */
export const read = async function ({
  lng = 'en',
  ns = 'translation'
} = {}) {
  return Promise.resolve()
    .then(() => {
      const resource = require(path.join(keyRoot(), lng, `${ns}.json`))
      _.set(_cache, `${lng}.${ns}`, resource)
    })
}

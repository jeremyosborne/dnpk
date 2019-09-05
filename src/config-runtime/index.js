import assert from 'assert'
import debug from 'debug'

const logger = debug('dnpk/config-runtime')

/**
 * Reference to the current runtime configuration object.
 *
 * This will be set and cached after first call to the data source.
 *
 * @type {object}
 */
let DATA_SOURCE = null

/**
 * Manages to the runtime configuration object.
 *
 * @type {Object}
 */
export const dataSource = {
  /**
   * Lazy get the runtime configuration, which will attempt to determine which
   * object we should regardless of environment.
   *
   * @return {object} the configuration object
   */
  get: () => {
    if (DATA_SOURCE) {
      return DATA_SOURCE
    } else {
      logger('First call. Determining DATA_SOURCE.')

      try {
        DATA_SOURCE = process.env
        // Only counts if it exists.
        assert(DATA_SOURCE)
        logger('process.env available, must be node.js.')
        return DATA_SOURCE
      } catch (err) {
        logger('no process.env')
      }

      try {
        DATA_SOURCE = window.DNPK_RUNTIME_CONFIGURATION
        // Only counts if it exists.
        assert(DATA_SOURCE)
        logger('window.DNPK_RUNTIME_CONFIGURATION available, must be a browser.')
        return DATA_SOURCE
      } catch (err) {
        logger('no window.DNPK_RUNTIME_CONFIGURATION')
      }

      logger('WARNING: could not find a runtime config object, defaulting to empty object with no external defaults set.')
      DATA_SOURCE = {}
      return DATA_SOURCE
    }
  },

  /**
   * Manually set a runtime configuration object.
   *
   * @param {object} config to inject
   */
  set: (config) => {
    DATA_SOURCE = config
  }
}

/**
 * Get a particular key from the run time congiuration object.
 *
 * All values are strings, and must be cast to another type by the caller.
 *
 * @param {string} key from which to return a value.
 * @return {string|undefined} value if set or undefined.
 */
export const get = (key) => {
  return dataSource.get()[key]
}

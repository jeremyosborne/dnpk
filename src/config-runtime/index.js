import * as dataSourceGlobal from 'data-source-global'
import * as dataSourceProcessEnv from 'data-source-process-env'
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
  get: ({
    // DI
    dataSourceGlobal: dsGlobal = dataSourceGlobal,
    dataSourceProcessEnv: dsProcessEnv = dataSourceProcessEnv,
  } = {}) => {
    if (DATA_SOURCE) {
      return DATA_SOURCE
    } else {
      logger('First call. Determining DATA_SOURCE.')

      if (dsProcessEnv.exists()) {
        DATA_SOURCE = dsProcessEnv.get()
        logger('using process.env.')
        return DATA_SOURCE
      }

      if (dsGlobal.exists()) {
        DATA_SOURCE = dsGlobal.get().DNPK_RUNTIME_CONFIGURATION
        // Do a double check to make sure this is truthy.
        if (DATA_SOURCE) {
          logger('using global DNPK_RUNTIME_CONFIGURATION.')
          return DATA_SOURCE
        }
        // else fall through ...
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
export const get = (key, {
  // DI
  dataSource: ds = dataSource
} = {}) => {
  return ds.get()[key]
}

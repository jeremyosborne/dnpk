import * as dataSourceGlobal from 'data-source-global'
import * as dataSourceProcessEnv from 'data-source-process-env'
import debug from 'debug'

const logger = debug('dnpk/config-runtime')

/**
 * Key we use to access our configuration from the global.
 */
export const DNPK_RUNTIME_CONFIGURATION_KEY = 'DNPK_RUNTIME_CONFIGURATION'

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

      // We want you to use process.env, but if you're modifying the global,
      // you must want us to prefer that configuration. And process.env has become
      // ubiquitous due to modern build tools, so it will often always exist
      // and no longer semantically means "this is node code not browser code."
      if (dsGlobal.exists()) {
        DATA_SOURCE = dsGlobal.get()[DNPK_RUNTIME_CONFIGURATION_KEY]
        // Unlike process.env, this is a total opt in.
        if (DATA_SOURCE) {
          logger('using global DNPK_RUNTIME_CONFIGURATION.')
          return DATA_SOURCE
        }
        // else fall through ...
      }

      if (dsProcessEnv.exists()) {
        DATA_SOURCE = dsProcessEnv.get()
        logger('using process.env.')
        return DATA_SOURCE
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

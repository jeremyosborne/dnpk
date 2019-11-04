import debug from 'debug'
import plainFlag from '../flag'
import _ from 'lodash'
import out from '../out'

const logger = debug('dnpk/ui/text/empire')

/**
 * Display just the flag of an empire.
 *
 * @param {object} empire or something that implements `color`.
 *
 * @return {string}
 */
export const string = ({empire}) => {
  if (!_.get(empire, 'color')) {
    logger('warning, called flag() with incompatible data param of:', empire)
  }

  return `${plainFlag.string(empire)}`
}

/**
 * Direct-to-out wrapper. See `string`.
 */
export const flag = (...args) => out(string(...args))

/**
 * Convenience. See `string`.
 */
flag.string = string

export default flag

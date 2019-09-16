import debug from 'debug'
import plainFlag from '../flag'
import _ from 'lodash'
import out from '../out'

const logger = debug('dnpk/ui/text/empire')

/**
 * Display just the flag of an empire.
 *
 * Versatile function that attempts to do the right thing depending on input.
 *
 * @param {object} data something that implements either `empire` or `player`
 * structure.
 *
 * @return {string}
 */
export const string = (data) => {
  const empire = _.get(data, 'empire') || data
  if (!_.get(empire, 'color')) {
    logger('warning, called flag() with incompatible data param of:', data)
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

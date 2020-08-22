import debug from 'debug'
import flag from '../flag'
import _out from '../out'
import short from './short'

const logger = debug('dnpk/ui/text/naming')

/**
 * Assume the entity is an empire and display the name as an empire.
 *
 * Versatile function that attempts to do the right thing depending on input.
 *
 * @param {object} entity
 *
 * @return {string}
 */
export const string = (entity) => {
  const name = short(entity)
  if (!name) {
    logger('warning, called title() with incompatible data param of:', entity)
  }

  return `${name} ${flag(entity)}`
}

/**
 * Direct-to-out wrapper. See `string`.
 */
export const out = (...args) => _out(string(...args))

/**
 * Convenience. See `string`.
 */
string.out = out

export default string

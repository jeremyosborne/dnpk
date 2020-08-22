import debug from 'debug'
import flag from '../flag'
import _out from '../out'
import * as naming from '../naming'

const logger = debug('dnpk/ui/text/empire')

/**
 * Display the empire name plus flag.
 *
 * Versatile function that attempts to do the right thing depending on input.
 *
 * @param {object} entity
 *
 * @return {string}
 */
export const string = (empire) => {
  const name = naming.short(empire)
  if (!name) {
    logger('warning, called title() with incompatible data param of:', empire)
  }

  return `${name} ${flag(empire)}`
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

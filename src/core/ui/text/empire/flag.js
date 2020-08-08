import debug from 'debug'
import plainFlag from '../flag'
import * as gameObjectsCommon from 'game-objects-common'
import out from '../out'

const logger = debug('dnpk/ui/text/empire')

/**
 * Display a flag based on entities cosmetic color.
 *
 * @param {object} entity or something that implements a `cosmetic` of `color`.
 *
 * @return {string}
 */
export const string = ({empire}) => {
  const color = gameObjectsCommon.cosmetics.color(empire)
  if (!color) {
    logger('warning, called flag() with incompatible data param that does not appear to implement a color:', empire)
  }

  return `${plainFlag.string({color})}`
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

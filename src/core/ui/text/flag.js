import debug from 'debug'
import * as gameObjectsCommon from 'game-objects-common'
import {t} from 'l10n'
import _out from './out'

const logger = debug('dnpk/ui/text/empire')

/**
 * Display a flag based on entity's cosmetic color.
 *
 * @param {object} entity or something that implements a `cosmetic` of `color`.
 *
 * @return {string}
 */
export const string = (entity) => {
  const label = '\u2691'
  let color = gameObjectsCommon.cosmetics.color(entity)
  if (!color) {
    logger('warning, called flag() with incompatible data param that does not appear to implement a color:', entity)
    color = '#FFFFFF'
  }

  return t('{{flag, colorize}}', {flag: {label, color}})
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

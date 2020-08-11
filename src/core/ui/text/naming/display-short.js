import * as gameObjectsCommon from 'game-objects-common'
import {t} from 'l10n'
import _ from 'lodash'
import out from '../out'

/**
 * Return a short, common name of any object which is visual friendly.
 *
 * @param {object|string} o some object we wish to coerce into a name.
 *
 * @return {string} preferred name for this object
 */
export const string = (o) => {
  if (_.isString(o)) {
    return t(o)
  } else {
    return gameObjectsCommon.cosmetics.naming.proper(o) || t(o.name) || t('UNKNOWN NAME')
  }
}

/**
 * Direct-to-out wrapper. See `string`.
 */
export const displayShort = (...args) => out(string(...args))

/**
 * Convenience. See `string`.
 */
displayShort.string = string

export default displayShort

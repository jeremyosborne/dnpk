import * as gameObjectsCommon from 'game-objects-common'
import {t} from 'l10n'
import _ from 'lodash'
import _out from '../out'

/**
 * Attempt to return a short, human friendly name of any object or collection of objects.
 *
 * As this focuses on "human" names, this prefers `armies` within an object, but not
 * other collections like `equipment`.
 *
 * @param {object|string} o some object we wish to coerce into a name.
 *
 * @return {string} preferred name for this object
 */
export const string = (o) => {
  let collection
  if (Array.isArray(o)) {
    collection = o
  } else if (gameObjectsCommon.armies.get(o)) {
    collection = gameObjectsCommon.armies.get(o)
  } else {
    collection = [o]
  }

  const names = _.map(collection, (item = {}) => {
    if (_.isString(item)) {
      // In case we get a string still try to do the right thing.
      return t(item)
    } else {
      return t(gameObjectsCommon.cosmetics.naming.proper(item)) || t(item.name) || t('WARNING: UNKNOWN NAME')
    }
  })

  return t('{{names, simpleList}}', {names})
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

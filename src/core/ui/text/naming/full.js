import * as gameObjectsCommon from 'game-objects-common'
import {t} from 'l10n'
import _ from 'lodash'
import _out from '../out'

/**
 * Attempt to return the full, human friendly name of any object or collection of objects.
 *
 * As this focuses on "human" names, this prefers `armies` within an object, but not
 * other collections like `equipment`.
 *
 * @param {object|string} o some object we wish to coerce into a name.
 *
 * @return {string} preferred name for this object
 */
export const string = (o) => {
  if (_.isString(o)) {
    return t(o)
  }

  // Are we a set of armies?
  let collection

  if (Array.isArray(o)) {
    collection = o
  } else if (gameObjectsCommon.armies.get(o)) {
    collection = gameObjectsCommon.armies.get(o)
  } else {
    collection = [o]
  }

  const names = _.map(collection, (item = {}) => {
    const names = _.compact([
      t(gameObjectsCommon.cosmetics.naming.proper(item)),
      // Trying out removing the title for full name. Just proper + flavor text.
      // t(gameObjectsCommon.cosmetics.naming.title(item)),
      t('{{flavors, simpleList}}', {flavors: gameObjectsCommon.cosmetics.naming.flavors(item)}),
      t(item.name),
    ])
    return t('{{names, simpleList}}', {names})
  })

  return t('{{names, complexList}}', {names})
}

/**
 * Direct-to-out wrapper. See `string`.
 */
export const out = (...args) => _out(string(...args))

/**
 * Convenience. See `out`.
 */
string.out = out

export default string

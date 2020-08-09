import cosmetics from '../cosmetics'
import {t} from 'l10n'
import _ from 'lodash'

/**
 * Return the effective name of any object which is visual friendly.
 *
 * This should be used for views, not as identification for subtypes.
 *
 * @param {object|string} o some object we wish to coerce into a name.
 *
 * @return {string} preferred name for this object
 */
export const name = (o) => {
  if (_.isString(o)) {
    return t(o)
  } else {
    return cosmetics.naming.proper(o) || t(o.name) || t('UNKNOWN NAME')
  }
}

export default name

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
    // If we're passed a string, we assume that somewhere duriing the data
    // processing to find a name, the name was determined before getting to
    // this function and that we pass back the string as is.
    return o
  } else {
    return o.nameInstance || t(o.name) || t('UNKNOWN NAME')
  }
}

export default name

import {t} from 'l10n'

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
  if (typeof o === 'string') {
    return o
  } else {
    return o.nameInstance || t(o.name) || t('UNKNOWN NAME')
  }
}

export default name

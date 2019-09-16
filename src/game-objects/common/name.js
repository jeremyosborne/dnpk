import {t} from 'l10n'

/**
 * Return the effective name of any object which is visual friendly.
 *
 * This should be used for views, not as identification for subtypes.
 *
 * @param {object} o instance
 *
 * @return {string} preferred name for this object
 */
export const name = (o) => o.nameInstance || t(o.name) || o.name

export default name

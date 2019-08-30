/**
 * Return the effective name of any object.
 *
 * @param {object} o instance
 *
 * @return {string} preferred name for this object
 */
export const nameEffective = (o) => o.nameInstance || o.name

export default nameEffective

import _ from 'lodash'
import * as objectList from '../object-list'

/**
 * Helpers for working with sets of `cosmetics` on an object.
 *
 * see: object-list
 */
export const cosmetics = objectList.create({attrPath: 'cosmetics'})

// Exception to the usual `import * as module from 'module'` rule due to
// usage of function factory.
export default cosmetics

//
// Extended API.
//

/**
 * Value of the first (in ascending positional order) color associated with an entity.
 *
 * @param {object|object[]} o requires something that implements `cosmetics`
 * or a simple array of cosmetics.
 *
 * @return {string}
 */
cosmetics.color = (o) => {
  const cosmetic = _.find(cosmetics.get(o), (cosmetic) => _.get(cosmetic, 'name') === 'color')
  return _.get(cosmetic, 'value') || ''
}

/**
 * Array of all of the deeds an entity has accomplished.
 *
 * @param {object|object[]} o requires something that implements `cosmetics`
 * or a simple array of cosmetics.
 *
 * @return {Array[]}
 */
cosmetics.deeds = (o) => {
  const deeds = _.filter(cosmetics.get(o), (cosmetic) => _.get(cosmetic, 'name') === 'deed')
  return deeds
}

/**
 * Various, common names an entity might be called.
 *
 * @type {Object}
 */
cosmetics.naming = {}

/**
 * Value of the first (in ascending positional order) naming-proper associated with an entity.
 *
 * @param {object|object[]} o requires something that implements `cosmetics`
 * or a simple array of cosmetics.
 *
 * @return {string}
 */
cosmetics.naming.proper = (o) => {
  const cosmetic = _.find(cosmetics.get(o), (cosmetic) => _.get(cosmetic, 'name') === 'naming-proper')
  return _.get(cosmetic, 'value') || ''
}

/**
 * Value of the first (in ascending positional order) naming-title associated with an entity.
 *
 * @param {object|object[]} o requires something that implements `cosmetics`
 * or a simple array of cosmetics.
 *
 * @return {string}
 */
cosmetics.naming.title = (o) => {
  const cosmetic = _.find(cosmetics.get(o), (cosmetic) => _.get(cosmetic, 'name') === 'naming-title')
  return _.get(cosmetic, 'value') || ''
}

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
 * Array of all color values associated with an entity.
 *
 * @param {object|object[]} o requires something that implements `cosmetics`
 * or a simple array of cosmetics.
 *
 * @return {string[]} may be an empty array
 */
cosmetics.colors = (o) => {
  return _.filter(cosmetics.get(o), (cosmetic) => _.get(cosmetic, 'name') === 'color').map((color) => color.value || '')
}

/**
 * Various, common names an entity might be called.
 *
 * @type {Object}
 */
cosmetics.naming = {}

/**
 * Array of all flavor values associated with an entity.
 *
 * @param {object|object[]} o requires something that implements `cosmetics`
 * or a simple array of cosmetics.
 *
 * @return {string[]} may be an empty array
 */
cosmetics.naming.flavors = (o) => {
  return _.filter(cosmetics.get(o), (cosmetic) => _.get(cosmetic, 'name') === 'naming-flavor').map((flavor) => flavor.value || '')
}

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

/**
 * Array of all titles associated with an entity.
 *
 * @param {object|object[]} o requires something that implements `cosmetics`
 * or a simple array of cosmetics.
 *
 * @return {string[]} may be an empty array
 */
cosmetics.naming.titles = (o) => {
  return _.filter(cosmetics.get(o), (cosmetic) => _.get(cosmetic, 'name') === 'naming-title').map((title) => title.value || '')
}

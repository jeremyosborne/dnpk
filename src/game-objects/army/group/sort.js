// @flow
import _ from 'lodash'
import * as is from '../is'
import strengthEffective from '../strength-effective'

/**
 * Sort a group into a battle ready formation.
 *
 * The head of the array is considered the most cannon-fodderable, and the
 * most heroic will lead from behind.
 *
 * @param {object[]} group of armies to sort into a battle ready formation.
 *
 * @return {object[]} a new array with references to the armies of the original,
 * sorted in combat ready (according to rules) order.
 */
export const sort = (group) => _.sortBy(group, [
  // Brave heroes lead from the rear!
  // sortBy is ascending order, so armies that are heroes will get sorted to end.
  (army) => is.hero(army) ? 1 : 0,
  // We want weaker armies before the uniform strength bonus is supplied to
  // be first in the list.
  strengthEffective,
])

export default sort

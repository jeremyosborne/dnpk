import _ from 'lodash'
import * as army from '../army'

/**
 * Sort a group into a battle ready formation.
 *
 * The head of the array is considered the most cannon-fodderable, and the
 * most heroic will lead from behind.
 *
 * @param {object|object[]} armyGroup contains `.armies` to sort into a battle ready
 * formation. Supports official `army-group` or simple list of armies.
 *
 * @return {object|object[]} if passed an army-group, the group will be returned
 * with a modified `.armies` property (new array, same contents referenced). If
 * passed a simple list, will return a list of armies.
 */
export const sort = (armyGroup) => {
  let armies = Array.isArray(armyGroup) ? armyGroup : armyGroup.armies
  armies = _.sortBy(armies, [
    // Brave heroes lead from the rear!
    // sortBy is ascending order, so armies that are heroes will get sorted to end.
    (a) => army.is.hero(a) ? 1 : 0,
    // We want weaker armies before the uniform strength bonus is supplied to
    // be first in the list.
    (a) => a.strength,
  ])

  if (Array.isArray(armyGroup)) {
    // simple list like input
    return armies
  } else {
    // modify official structure
    armyGroup.armies = armies
    return armyGroup
  }
}

export default sort

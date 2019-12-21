import armies from './armies'
import effects from '../effects'
import _ from 'lodash'
import * as strength from 'simulation/strength'

/**
 * Sort a group into a battle ready formation.
 *
 * The head of the array is considered the most cannon-fodderable, and the
 * most heroic will lead from behind.
 *
 * This method does not mutate the original data, whether an array or an object
 * containing `armies`.
 *
 * @param {object|object[]} armyGroup contains `.armies` to sort into a battle ready
 * formation. Supports official `army-group` or simple list of armies.
 *
 * @return {object|object[]} if passed an army-group, the group will be returned
 * with a modified `.armies` property (new array, same contents referenced). If
 * passed a simple list, will return a list of armies.
 */
export const sort = (o) => {
  let _armies = armies.get(o)
  _armies = _.sortBy(_armies, [
    // Brave heroes lead from the rear!
    // sortBy is ascending order, so armies that are heroes will get sorted to end.
    (army) => effects.hasName(army, 'hero') ? 1 : 0,
    (army) => {
      // More special units, which also happen to provide auras, fight last.
      return _.reduce([
        'aerial',
        'elite',
      ], (specialness, effectName) => {
        specialness += effects.hasName(army, effectName) ? 1 : 0
        return specialness
      }, 0)
    },
    // We want weaker armies before the uniform strength bonus is supplied to
    // be first in the list. We also want to include the modifications from strength
    // items and from strength effects, but not auras.
    (army) => strength.army.strength({army}),
  ])

  if (!armies._isStruct(o)) {
    // simple list like input
    return _armies
  } else {
    // return copied / modified official structure
    return {
      ...o,
      armies: _armies,
    }
  }
}

export default sort

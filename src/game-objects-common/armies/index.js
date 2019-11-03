import debug from 'debug'
import effects from '../effects'
import _ from 'lodash'
import * as objectList from '../object-list'
import * as strength from 'simulation/strength'

const _logger = debug('dnpk/game-objects-common/armies')

/**
 * Helpers for working with sets of `armies` on an object.
 *
 * see: object-list
 */
export const armies = objectList.create({attrPath: 'armies'})

// Exception to the usual `import * as module from 'module'` rule due to
// usage of function factory.
export default armies

//
// Extended API.
//

/**
 * Remove units from an army-group, mutating the army-group in place.
 *
 * @param args
 * @param {object|object[]} [args.armyGroup=[]] the army-group to remove the armies
 * from. The army-like objects only need implement `.id`. If the input is an
 * army-group structure, the `.armies` property will be changed but the outer
 * structure will not.
 * @param {object|object[]} [args.casualties=[]] which armies have died and should be
 * removed from the group.
 *
 * @param {object} [config] configuration as dictionary
 * @param {object} [config.logger] oddities will get reported.
 *
 * @return {{casualties: object[], equipment: object[]}} returns the equipment
 * references to the removed casualties. The army-group is changed in place.
 */
armies.kill = ({
  armyGroup = [],
  casualties = [],
}, {
  logger = _logger
} = {}) => {
  return _.reduce(casualties, (pileOfDead, dead) => {
    const removed = armies.remove(armyGroup, dead)
    if (removed) {
      // bring out the dead
      pileOfDead.casualties.push(removed)
      if (removed.equipment && removed.equipment.length) {
        // transfer equipment to one pile
        pileOfDead.equipment = _.concat(pileOfDead.equipment, removed.equipment)
        removed.equipment = []
      }
    } else {
      logger(`Warning: attempting to remove ${JSON.stringify(dead)} that does not exist in armyGroup: ${JSON.stringify(armyGroup)}`)
    }
    return pileOfDead
  }, {
    // Reference to the actual objects that were contained.
    casualties: [],
    // Reference to all equipment that was carried by casualties.
    equipment: [],
  })
}

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
armies.sort = (o) => {
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

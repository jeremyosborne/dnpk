import * as armies from './armies'
import debug from 'debug'
import _ from 'lodash'

const _logger = debug('dnpk/game-objects-common/armies/kill')

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
export const kill = ({
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

export default kill

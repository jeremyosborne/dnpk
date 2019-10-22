import debug from 'debug'
import * as armies from './armies'
import _ from 'lodash'

const logger = debug('dnpk/game-objects/army-group/do/kill')

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
 * @return {{casualties: object[], equipment: object[]}} returns the equipment
 * references to the removed casualties. The army-group is changed in place.
 */
export const kill = ({
  armyGroup = [],
  casualties = [],
}) => {
  return _.reduce(casualties, (pileOfDead, dead) => {
    const removed = armies.remove({armyGroup, army: dead})
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
    casualties: [],
    equipment: [],
  })
}

export default kill

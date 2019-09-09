import _ from 'lodash'

/**
 * Add a reference from the player to the army group.
 *
 * Does not duplicate already existing references to army groups.
 *
 * @param {object} player
 * @param {object[]} army
 */
export const add = ({player, armyGroup}) => {
  if (_.indexOf(player.armyGroups, armyGroup) === -1) {
    player.armyGroups.push(armyGroup)
  }
}

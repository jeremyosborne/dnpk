import _ from 'lodash'

/**
 * Add a reference from the player to the army group.
 *
 * Does not duplicate already existing references to army groups.
 *
 * @param {object} args as dictionary
 * @param {object} args.player player to add the army group to
 * @param {object[]} args.armyGroup to add
 */
export const add = ({player, armyGroup}) => {
  if (_.indexOf(player.armyGroups, armyGroup) === -1) {
    player.armyGroups.push(armyGroup)
  }
}

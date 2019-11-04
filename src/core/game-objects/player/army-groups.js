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
  if (player && armyGroup && (!_.find(player.armyGroups, (ag) => ag.id === armyGroup.id))) {
    player.armyGroups.push(armyGroup)
  }
}

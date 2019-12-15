import armyRandom from './army-random'
import * as gameObjects from 'game-objects'
import * as gameObjectsCommon from 'game-objects-common'
import _ from 'lodash'
import * as simulation from 'simulation'

/**
 * Create a random player.
 *
 * @param {object} args parameters as associative array
 * @param {number} [args.numberOfArmyGroups=1] how many army groups to create by default.
 * @param {number} [args.armyGroupSize=8] the default size of the groups generated
 * for this player.
 *
 * @return {object} a randomly generated test player.
 */
export const playerRandom = ({
  numberOfArmyGroups = 1,
  armyGroupSize = 8,
} = {}) => {
  const player = gameObjects.player.create()

  player.empire = simulation.createRandom({type: 'empire'})
  player.armyGroups = _.times(numberOfArmyGroups, () => gameObjectsCommon.armies.sort(_.times(armyGroupSize, armyRandom)))

  return player
}

export default playerRandom

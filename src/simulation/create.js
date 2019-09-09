import * as gameObjects from 'game-objects'
import _ from 'lodash'

/**
 * Create a random army.
 *
 * @return {object} an army instance, randomly generated.
 */
export const armyRandom = () => {
  const army = gameObjects.army.create.random()
  if (gameObjects.army.is.hero(army)) {
    // Equip heroes with an item.
    const eq = gameObjects.equippable.create.random()
    gameObjects.army.do.equip(army, eq)
  }
  return army
}

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

  player.empire = gameObjects.empire.create.random()
  player.armyGroups = _.times(numberOfArmyGroups, () => _.times(armyGroupSize, armyRandom))

  return player
}

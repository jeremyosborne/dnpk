import * as gameObjects from 'game-objects'
import randomWeightedArmies from '../randomWeightedArmies'

/**
 * Create a randomized army-group from a the set of armies with weighting rules
 * applied to the choice of included armies.
 *
 * @param {object} args
 * @param {object} [args.exclude] keys with truthy values will be excluded from the
 * potential set from which we sample.
 * @param {number} [args.size=8] size of the army-group returned.
 *
 * @return {object[]} army instances in an army-group.
 */
export const createRandomWeightedArmyGroup = ({exclude, size = 8} = {}) => {
  const names = randomWeightedArmies({size, exclude})
  const armyGroup = names.map((name) => gameObjects.army.create({name}))
  // Perform a UI friendly sort before returning.
  return gameObjects.armyGroup.sort(armyGroup)
}

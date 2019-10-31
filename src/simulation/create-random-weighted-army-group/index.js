import * as gameObjects from 'game-objects'
import randomWeightedArmies from '../random-weighted-armies'

/**
 * Create a randomized army-group from a the set of armies with weighting rules
 * applied to the choice of included armies.
 *
 * @param {object} args
 * @param {array} [args.exclude] values will be excluded from the potential set
 * from which we sample.
 * @param {number} [args.size=8] size of the army-group returned.
 *
 * @return {object} an `army-group`
 */
export const createRandomWeightedArmyGroup = ({exclude, size = 8} = {}) => {
  const names = randomWeightedArmies({size, exclude})
  const armies = names.map((name) => gameObjects.army.create({name}))
  const armyGroup = gameObjects.armyGroup.create({armies})
  return gameObjects.armyGroup.sort(armyGroup)
}

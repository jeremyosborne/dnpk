import * as create from '../create'
import * as gameObjects from 'game-objects'
import * as gameObjectsCommon from 'game-objects-common'
import randomWeightedArmies from '../random-weighted-armies'

/**
 * Create a randomized list of armies in an army-group.
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
  const armies = names.map((name) => {
    return create.army({name})
  })
  const armyGroup = gameObjects.armyGroup.create({armies})
  return gameObjectsCommon.armies.sort(armyGroup)
}

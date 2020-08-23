import * as gameObjects from 'game-objects'
import * as gameObjectsCommon from 'game-objects-common'
import randomNaming from '../random-naming'
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
  const armies = names.map((name) => {
    const army = gameObjects.army.create({name})
    // TODO: I don't think the hero naming, or other cosmetics, should be done here. This should
    // just create the random armies and they should be decorated elsewhere.
    if (gameObjectsCommon.is.hero(army)) {
      gameObjectsCommon.cosmetics.add(army, {name: 'naming-proper', value: randomNaming({name: 'hero'})})
    }
    return army
  })
  const armyGroup = gameObjects.armyGroup.create({armies})
  return gameObjectsCommon.armies.sort(armyGroup)
}

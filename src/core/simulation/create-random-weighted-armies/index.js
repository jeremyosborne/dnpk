import * as gameObjects from 'game-objects'
import * as gameObjectsCommon from 'game-objects-common'
import randomNaming from '../random-naming'
import randomWeightedArmies from '../random-weighted-armies'

/**
 * Create a randomized list of armies.
 *
 * @param {object} args
 * @param {array} [args.exclude] values will be excluded from the potential set
 * from which we sample.
 * @param {number} [args.size=8] number of armies in the list.
 *
 * @return {object[]} a list of armies
 */
export const createRandomWeightedArmies = ({exclude, size = 8} = {}) => {
  const names = randomWeightedArmies({size, exclude})
  const armies = names.map((name) => {
    const army = gameObjects.army.create({name})
    // TODO: I don't think the hero naming, or other cosmetics, should be done here. This should
    // just create the random armies and they should be decorated elsewhere.
    if (gameObjectsCommon.is.hero(army)) {
      gameObjectsCommon.cosmetics.add(army, {name: 'naming-proper', value: randomNaming({name: 'hero'})})
    }
    if (!gameObjectsCommon.effects.hasName(army, 'elite')) {
      // Elite units are already special enough.
      gameObjectsCommon.cosmetics.add(army, {name: 'naming-flavor', value: randomNaming({name: 'flavor-army'})})
    }
    return army
  })
  return armies
}

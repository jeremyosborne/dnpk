import * as gameObjects from 'game-objects'
import * as gameObjectsCommon from 'game-objects-common'
import randomNaming from '../random-naming'
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
  const armyGroup = gameObjects.armyGroup.create({armies})
  return gameObjectsCommon.armies.sort(armyGroup)
}

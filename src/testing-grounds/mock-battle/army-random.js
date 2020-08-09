import * as gameObjectsCommon from 'game-objects-common'
import * as simulation from 'simulation'

/**
 * Create a random army.
 *
 * @return {object} an army instance, randomly generated.
 */
export const armyRandom = () => {
  const army = simulation.createRandom({type: 'army'})
  if (gameObjectsCommon.effects.hasName(army, 'hero')) {
    // Equip heroes with an item.
    const equippable = simulation.createRandom({type: 'equippable'})
    gameObjectsCommon.equipment.add(army, equippable)
    // Give a name to the hero.
    gameObjectsCommon.cosmetics.add(army, {name: 'naming-proper', value: simulation.randomNaming({name: 'hero'})})
  }
  return army
}

export default armyRandom

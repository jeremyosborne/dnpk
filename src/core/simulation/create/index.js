/**
 * Kitchen sink object creators that should be built with all the configuration we need
 * for creating fleshed out in game objects.
 */
import * as gameObjectsCommon from 'game-objects-common'
import randomNaming from '../random-naming'

/**
 * General army creation that tries to do the right thing in terms of generic army creation.
 */
export const army = ({name}) => {
  const army = gameObjectsCommon.create('army', {name})

  // Cosmetics
  if (gameObjectsCommon.is.hero(army)) {
    const cosmetic = gameObjectsCommon.create('cosmetic', {name: 'naming-proper', value: randomNaming({name: 'hero'})})
    gameObjectsCommon.cosmetics.add(army, cosmetic)
  }
  if (!gameObjectsCommon.effects.hasName(army, 'elite') && !gameObjectsCommon.effects.hasName(army, 'aerial')) {
    // Some units are already flavored enough.
    const cosmetic = gameObjectsCommon.create('cosmetic', {name: 'naming-flavor', value: randomNaming({name: 'hero'})})
    gameObjectsCommon.cosmetics.add(army, cosmetic)
  }

  return army
}

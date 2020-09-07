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
    gameObjectsCommon.cosmetics.add(army, {name: 'naming-proper', value: randomNaming({name: 'hero'})})
  }
  if (!gameObjectsCommon.effects.hasName(army, 'elite')) {
    // Elite units are already special enough.
    gameObjectsCommon.cosmetics.add(army, {name: 'naming-flavor', value: randomNaming({name: 'flavor-army'})})
  }

  return army
}

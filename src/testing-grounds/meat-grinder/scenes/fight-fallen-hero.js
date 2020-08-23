import {createScene} from './fight-common'
import * as gameObjects from 'game-objects'
import * as gameObjectsCommon from 'game-objects-common'
import {t} from 'l10n'
import _ from 'lodash'
import * as random from 'random'
import * as simulation from 'simulation'
import * as ui from 'ui'

const createAntagonist = ({protagonist}) => {
  const armyGroup = _.times(random.randint(1, 3), () => {
    // Variable cannon fodder with potential to be stronger than usual, at the downside
    // of also potentially being a bit weaker.
    const army = gameObjects.army.create({name: 'heavy-infantry'})
    army.strength = random.randint(3, 5)
    army.health = random.randint(1, 3)
    return army
  })
  // Maybe a wizard companion.
  if (random.randint(1, 10) >= 7) {
    const wizard = gameObjects.army.create({name: 'wizard'})
    armyGroup.push(wizard)
  }
  const blackKnight = gameObjects.army.create({name: 'hero'})
  // Potentially very strong opponent.
  blackKnight.strength = random.randint(4, 9)
  gameObjectsCommon.cosmetics.add(blackKnight, {name: 'naming-proper', value: simulation.randomNaming({name: 'hero'})})
  armyGroup.push(blackKnight)

  const fightSceneState = {
    antagonist: {
      empire: simulation.createRandom({
        exclude: [protagonist.empire.name],
        type: 'empire',
      }),
      armyGroup,
      structures: []
    },
  }
  fightSceneState.messages = {
    prelude: t('A fallen knight of {{empire}} blocks your path.', {empire: ui.text.naming.short(fightSceneState.antagonist.empire)}),
  }
  return fightSceneState
}

/**
 * Put the protagonist's army-group through one random encounter with a tougher than usual
 * hero and entourage.
 *
 *     "The DM rolls for a random encounter,
 *         and lo you are beset by Mr. Tis-but-a-scratch."
 */
export const scene = createScene({createAntagonist})

export default scene

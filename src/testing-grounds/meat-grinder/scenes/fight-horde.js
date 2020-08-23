import {createScene} from './fight-common'
import * as gameObjects from 'game-objects'
import {t} from 'l10n'
import _ from 'lodash'
import * as random from 'random'
import * as simulation from 'simulation'
import * as ui from 'ui'
import * as wrappers from './wrappers'

const createAntagonist = ({protagonist}) => {
  // For the HORDE!
  const armyGroup = _.times(random.randint(15, 25), () => {
    const army = gameObjects.army.create({name: 'light-infantry'})
    army.strength = random.randint(1, 3)
    army.health = 1
    return army
  })

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
    prelude: t('A horde of {{empire}} forces gather here. There are many of them.', {empire: ui.text.naming.short(fightSceneState.antagonist.empire)}),
  }
  return fightSceneState
}

/**
 * Put the protagonist's army-group through one random encounter style battle
 * with a horde of monsters.
 *
 *     "The DM rolls for a random encounter,
 *         and lo you are beset by many, many goblins."
 *
 * While large in number, the opponents in our horde scenario are significantly weaker than usual,
 * likely a routed army or fleeing a city siege.
 */
export const scene = createScene({createAntagonist})

export default _.flowRight([
  wrappers.throwIfNoArmyGroup,
  wrappers.throwIfNoEmpire,
  wrappers.uiWhiteSpace,
  wrappers.uiGameTurn,
  wrappers.uiTerrain,
])(scene)

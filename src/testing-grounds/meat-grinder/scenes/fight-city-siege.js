import {createScene} from './fight-common'
import * as gameObjectsCommon from 'game-objects-common'
import {t} from 'l10n'
import _ from 'lodash'
import * as random from 'random'
import * as simulation from 'simulation'
import * as ui from 'ui'
import * as wrappers from './wrappers'

const createAntagonist = ({protagonist}) => {
  // Keep the castle troops fodderish.
  const exclude = _.filter(gameObjectsCommon.def('army'), (aDef) => {
    if (
      gameObjectsCommon.effects.hasName(aDef, 'aerial') ||
        gameObjectsCommon.effects.hasName(aDef, 'elite') ||
        gameObjectsCommon.is.hero(aDef)
    ) {
      return true
    } else {
      return false
    }
  }).map((aDef) => aDef.name)

  // Defenders get some significant defense.
  const structure = gameObjectsCommon.create('structure', {name: 'city'})
  // Modify the defense of the brawn-aura to 2.
  const brawnAura = _.find(gameObjectsCommon.effects.get(structure), (effect) => effect.name === 'brawn-aura')
  // All cities should have a brawnAura, breaking here is good if that changes.
  brawnAura.magnitude = 2

  const fightSceneState = {
    antagonist: {
      empire: simulation.createRandom({
        exclude: [protagonist.empire.name],
        type: 'empire',
      }),
      armyGroup: simulation.createRandomWeightedArmyGroup({
        exclude,
        size: random.randint(10, 30),
      }),
      structures: [structure]
    },
  }
  fightSceneState.messages = {
    prelude: t('A city belonging to {{empire}} looms before you. There are many defenders resisting your siege.', {empire: ui.text.naming.short(fightSceneState.antagonist.empire)}),
  }
  return fightSceneState
}

/**
 * Put the protagonist's army-group through a battle with them sieging a city.
 *
 *     "The DM, ecstatic you played along with the narrative and stopped
 *         brawling in the bar, announces your likely demise at the siege
 *             of the Fortress of Marthos."
 *
 * Trivia: The Fortress of Marthos is the Sirian capital in the first Warlords, and
 * is likely the most sieged city in the game.
 *
 * This is a city siege against common troops, although still a tough battle for any
 * but the most elite protagonist.
 */
export const scene = createScene({createAntagonist})

export default _.flowRight([
  wrappers.throwIfNoArmyGroup,
  wrappers.throwIfNoEmpire,
  wrappers.uiWhiteSpace,
  wrappers.uiGameTurn,
  wrappers.uiTerrain,
])(scene)

import {createScene} from './fight-common'
import * as gameObjectsCommon from 'game-objects-common'
import {t} from 'l10n'
import * as simulation from 'simulation'
import * as ui from 'ui'

const createAntagonist = ({protagonist}) => {
  const fightSceneState = {
    antagonist: {
      empire: simulation.createRandom({
        exclude: [protagonist.empire.name],
        type: 'empire',
      }),
      armyGroup: simulation.createRandomWeightedArmyGroup({
        size: Math.ceil(gameObjectsCommon.armies.size(protagonist.armyGroup) / 2)
      }),
      structures: [],
    },
  }
  fightSceneState.messages = {
    prelude: t('The opposing forces of {{empire}} gather here.', {empire: ui.text.naming.short(fightSceneState.antagonist.empire)}),
  }
  return fightSceneState
}

/**
 * Put the protagonist's army-group through one random encounter style battle:
 *
 *     "The DM rolls for a random encounter,
 *         and lo you are beset by wolf riders."
 *
 * This is a battle that, in most circumstances, that the protagonist should win, even
 * though they are destined to lose the war.
 */
export const scene = createScene({createAntagonist})

export default scene

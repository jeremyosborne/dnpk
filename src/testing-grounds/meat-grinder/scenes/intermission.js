import {prompt} from 'enquirer'
import * as gameObjectsCommon from 'game-objects-common'
import hitReturnToContinue from 'hit-return-to-continue'
import _ from 'lodash'
import {t} from 'l10n'
import * as sceneChoices from './scene-choices'
import * as ui from 'ui'
import * as wrappers from './wrappers'

/**
 * Follows every significant scene and acts as a moment of respite.
 */
export const scene = async ({protagonist: {armyGroup}}) => {
  const subScenes = {
    armyGroupStatus: {
      next: async () => {
        if (gameObjectsCommon.armies.size(armyGroup)) {
          ui.text.armyGroup.out(armyGroup)
          await hitReturnToContinue()
        } else {
          await hitReturnToContinue(t('You have no army currently. You should recruit one.'))
        }
        return 'mainMenu'
      },
    },
    continueQuest: {
      done: () => {
        // Give the protagonist a fresh army-group if they don't have one...
        if (!gameObjectsCommon.armies.size(armyGroup)) {
          return sceneChoices.defeat()
        } else {
          return sceneChoices.generalEncounter()
        }
      }
    },
    mainMenu: {
      next: async () => {
        const choices = [
          {
            message: t('Continue quest'),
            name: 'continueQuest',
          },
          {
            message: t('View army group status'),
            name: 'armyGroupStatus',
          },
          {
            message: t('Save and Quit'),
            name: 'saveAndQuit',
          }
        ]
        const {action} = await prompt({
          initial: 0,
          message: t('This is a peaceful location. What do you wish to do?'),
          name: 'action',
          type: 'select',
          choices,
        })
        return action
      }
    },
    saveAndQuit: {
      done: () => null
    }
  }

  // State machine-ish code. Scene objects implement either an `next` or a `done` function.
  //
  // If `next` the async function is called and the returned string value should reference
  // the next state to deal with.
  //
  // If `done` the function is called and the return value is passed to the game loop ending
  // this intermission.
  let subSceneName = 'mainMenu'
  while (subSceneName) {
    const subScene = subScenes[subSceneName]
    if (!subScene) {
      throw new Error(`Attempted to reference subScene ${subScene} which does not exist for the intermission.`)
    }
    if (subScene.done) {
      return subScene.done()
    }
    subSceneName = await subScene.next()
  }
}

export default _.flowRight([
  wrappers.throwIfNoEmpire,
  wrappers.uiWhiteSpace,
  wrappers.uiGameTurn,
  wrappers.uiTerrain,
])(scene)

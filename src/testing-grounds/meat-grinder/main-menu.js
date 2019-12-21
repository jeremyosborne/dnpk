import createProtagonist from './create-protagonist'
import createArmyGroup from './create-army-group'
import * as dataSourceGame from 'meat-grinder/data-source-game'
import {prompt} from 'enquirer'
import gameLoop from './game-loop'
import * as gameObjectsCommon from 'game-objects-common'
import {t} from 'l10n'
import _ from 'lodash'
import mausoleum from './mausoleum'
import sceneTest from './scene-test'
import out from 'out'
import gameDataManagement from './game-data-management'
import * as ui from 'ui'

//
// Provide a menu to single select an action to run within the meat grinder.
//
export const mainMenu = async () => {
  const protagonist = dataSourceGame.protagonist.get()
  const armyGroup = _.get(protagonist, 'armyGroups[0]')

  let actions
  if (!protagonist) {
    // If we don't have a protagonist, then we don't display anything.
    actions = [{
      message: t('Create a protagonist (required for the meat grinder)'),
      next: async () => {
        await createProtagonist()
        return mainMenu
      }
    }]
  } else {
    out.t('{{empire, commonName}} {{flag}}', {empire: protagonist.empire, flag: ui.text.empire.flag.string(protagonist)})
    if (gameObjectsCommon.armies.size(armyGroup)) {
      out.t('Army group: {{armyGroup, commonName}}', {armyGroup})
    } else {
      out.t('Army group: none')
    }
    out('')

    // Sub-menu actions, other than the obvious, want to return to this menu.
    actions = [
      {
        message: t('Enter the meat grinder'),
        next: async () => {
          await gameLoop()
          return mainMenu
        }
      },
      {
        message: t('Choose a new empire'),
        next: async () => {
          await createProtagonist()
          return mainMenu
        }
      },
      {
        message: gameObjectsCommon.armies.size(armyGroup) ? t('Choose a new army group, disbanding this one')
          : t('Create a new army group.'),
        next: async () => {
          await createArmyGroup()
          return mainMenu
        }
      },
      {
        message: t('Test a specific scene of the meat grinder'),
        next: async () => {
          await sceneTest()
          return mainMenu
        }
      },
      {
        message: t('Pay respects at the Mausoleum'),
        next: async () => {
          await mausoleum()
          return mainMenu
        }
      },
      {
        message: t('Manage game data'),
        next: async () => {
          await gameDataManagement()
          return mainMenu
        }
      },
      {
        message: t('Exit'),
        next: () => null
      }
    ]
  }

  const answer = await prompt({
    type: 'select',
    message: t('Meat grinder options'),
    name: 'action',
    // Map our action objects into enquirer friendly action objects that don't
    // like functions for `value`s...
    choices: _.map(actions, ({message}, index) => ({name: _.toString(index), message})),
  })

  // ...look up the action function from the response.
  return _.get(actions, `${answer.action}.next`)
}

export default mainMenu

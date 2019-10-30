import * as dataSourceGame from 'data-source-game'
import {prompt} from 'enquirer'
import gameLoop from './game-loop'
import * as gameObjectsCommon from 'game-objects-common'
import hitReturnToContinue from 'hit-return-to-continue'
import {t} from 'l10n'
import _ from 'lodash'
import out from 'out'
import mausoleum from './mausoleum'
import * as ui from 'ui'

export const menu = async () => {
  const protagonist = dataSourceGame.protagonist.get()
  if (!protagonist) {
    await hitReturnToContinue(t('You must create a protagonist before participating in the meat grinder.'))
    return null
  }

  const armyGroup = _.get(protagonist, 'armyGroups[0]')

  out.t('{{empire, commonName}} {{flag}}', {empire: protagonist.empire, flag: ui.text.empire.flag.string(protagonist)})
  if (gameObjectsCommon.armies.size(armyGroup)) {
    out.t('Army group: {{armyGroup, commonName}}', {armyGroup})
  } else {
    out.t('Army group: none')
  }
  out('')

  // Sub-menu actions, other than the obvious, want to return to this menu.
  const actions = [
    {
      message: t('Enter the meat grinder'),
      next: async () => {
        await gameLoop()
        return menu
      }
    },
    {
      message: t('Pay respects at the Mausoleum'),
      next: async () => {
        await mausoleum()
        return menu
      }
    },
    {
      message: t('Main menu'),
      next: () => null
    }
  ]

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

export default menu

//
// Meat grinder: an almost idle adventure for the testing-grounds to try out
// prose, storyboarding, rules, mechanics, and act as an old god, throwing
// the mortals into the hell of battle.
//
// Flow:
//
// - Entry Requirement: Player must have a protagonist.
// - Entry Requirement: Player must have an army-group.
//

import * as dataSourceGame from 'data-source-game'
import {prompt} from 'enquirer'
import fight from './fight'
import * as gameObjects from 'game-objects'
import * as gameRules from 'game-rules'
import hitReturnToContinue from 'hit-return-to-continue'
import {t} from 'l10n'
import _ from 'lodash'
import out from 'out'
import * as ui from 'ui'

export const menu = async () => {
  const protagonist = dataSourceGame.protagonist.get()
  if (!protagonist) {
    await hitReturnToContinue(t('You must create a protagonist before participating in the meat grinder.'))
    return null
  }

  const armyGroup = _.get(protagonist, 'armyGroups[0]')
  if (!gameObjects.armyGroup.size(armyGroup)) {
    await hitReturnToContinue(t('You must have an army-group before participating in the meat grinder.'))
    return null
  }

  out.t('Empire: {{empire, commonName}}', protagonist)
  out.t('Using ruleset: {{rules}}', {rules: gameRules.nameDefault()})
  out.t('Flag: {{flag}}', {flag: ui.text.empire.flag.string(protagonist)})
  out.t('Army group: {{armyGroup, commonName}}', {armyGroup})

  // Sub-menu actions, other than the obvious, want to return to this menu.
  const actions = [
    {
      message: 'Fight',
      next: async () => {
        await fight()
        return menu
      }
    },
    {
      message: 'Main menu',
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

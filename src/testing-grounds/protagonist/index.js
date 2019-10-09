import armies from './armies'
import create from './create'
import * as dataSourceGame from 'data-source-game'
import {prompt} from 'enquirer'
import _ from 'lodash'
import out from 'out'
import * as ui from 'ui'

export const menu = async () => {
  const protagonist = dataSourceGame.protagonist.get()

  if (protagonist) {
    out.t('Protagonist')
    out.t('Empire: {{empire, commonName}}', {...protagonist})
    out.t('Flag: {{flag}}', {flag: ui.text.empire.flag.string(protagonist)})
  } else {
    out.t('No protagonist chosen yet.')
  }

  // Sub-menu actions, other than the obvious, want to return to this menu.
  const actions = [
    {
      message: protagonist ? 'Choose a new empire' : 'Create protagonist',
      next: async () => {
        await create()
        return menu
      },
    },
    {
      message: 'Main menu',
      next: () => null
    }
  ]

  if (protagonist) {
    actions.unshift({
      message: 'Manage armies',
      next: async () => {
        await armies()
        return menu
      },
    })
  }

  const answer = await prompt({
    type: 'select',
    message: 'Protagonist Options',
    name: 'action',
    // Map our action objects into enquirer friendly action objects that don't
    // like functions for `value`s...
    choices: _.map(actions, ({message}, index) => ({name: _.toString(index), message})),
  })

  // ...look up the action function from the response.
  return _.get(actions, `${answer.action}.next`)
}

export default menu

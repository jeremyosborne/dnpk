//
// For data we want to save, see: https://github.com/sindresorhus/env-paths
//

import * as configGameObjects from 'config-game-objects'
import * as dataSourceGame from 'data-source-game'
import {prompt} from 'enquirer'
import * as l10n from 'l10n'
import _ from 'lodash'
import mockBattle from 'mock-battle'
import out from 'out'
import protagonist from 'protagonist'

export const mainMenu = async () => {
  const actions = [
    {
      message: 'Protagonist options',
      next: protagonist,
    },
    {
      message: 'Run a randomized, mock battle',
      next: mockBattle,
    },
    {
      message: 'Quit',
      next: () => process.exit(0),
    },
  ]

  const answer = await prompt({
    type: 'select',
    message: 'DNPK Testing Grounds: Main Menu',
    name: 'action',
    // Map our action objects into enquirer friendly action objects that don't
    // like functions for `value`s...
    choices: _.map(actions, ({message}, index) => ({name: _.toString(index), message})),
  })

  // ...look up the action function from the response.
  return _.get(actions, `[${answer.action}].next`)
}

// int main(void)
export const main = async ({defaultState = mainMenu} = {}) => {
  await l10n.init()
  await configGameObjects.load()

  // load any of our specific testing-ground data.
  await dataSourceGame.read()

  // try/catch to handle ctrl-c and other program escapes since enquirer needs
  // to do some flavor of magic to intercept and handle key presses, we don't
  // write our own signal listeners but assume theirs are running since this
  // is mainly a REPL.
  try {
    let next = defaultState
    while (true) {
      // console.clear()
      next = await next() || defaultState
    }
  } catch (err) {
    out('something happened, terminating. Error:', err)
  }
}

if (require.main === module) {
  main()
}

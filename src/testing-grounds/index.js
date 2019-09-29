//
// For data we want to save, see: https://github.com/sindresorhus/env-paths
//

import * as configGameObjects from 'config-game-objects'
import createProtagonist from './create-protagonist'
import * as dataSourceGame from './data-source-game'
import {prompt} from 'enquirer'
import {
  init as l10nInit,
  // t,
} from 'l10n'
import _ from 'lodash'
import mockBattle from './mock-battle'
import viewProtagonist from './view-protagonist'

export const mainMenu = async () => {
  const actions = {
    1: {
      message: 'Make a new protagonist',
      next: createProtagonist,
    },
    2: {
      message: 'View current protagonist',
      next: viewProtagonist,
    },
    3: {
      message: 'Run a random, mock battle.',
      next: mockBattle,
    },
    4: {
      message: 'Quit',
      next: () => process.exit(0),
    },
  }

  const answer = await prompt({
    type: 'select',
    message: 'DNPK Testing Grounds: Main Menu',
    name: 'action',
    // Map our action object into enquirer friendly action objects that don't
    // like functions.
    choices: _.map(actions, ({message}, name) => ({name, message})),
  })

  return _.get(actions, `${answer.action}.next`)
}

// int main(void)
export const main = async ({defaultState = mainMenu} = {}) => {
  await l10nInit()
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
    console.log('something happened, terminating. Error:', err)
  }
}

if (require.main === module) {
  main()
}

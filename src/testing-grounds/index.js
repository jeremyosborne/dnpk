//
// For data we want to save, see: https://github.com/sindresorhus/env-paths
//

import * as dataSourceGameObjects from 'data-source-game-objects'
import * as dataSourceGame from 'data-source-game'
import {prompt} from 'enquirer'
import * as l10n from 'l10n'
import _ from 'lodash'
import mockBattle from 'mock-battle'
import monteCarlo from 'monte-carlo'
import out from 'out'
import protagonist from 'protagonist'
import removeGameData from 'remove-game-data'

const {t} = l10n

export const mainMenu = async () => {
  const actions = [
    {
      message: t('Protagonist options'),
      next: protagonist,
    },
    {
      message: t('Monte carlo'),
      next: monteCarlo,
    },
    {
      message: t('Run a randomized, mock battle'),
      next: mockBattle,
    },
    {
      message: t('Remove existing game data'),
      next: removeGameData,
    },
    {
      message: t('Quit'),
      next: () => process.exit(0)
    },
  ]

  const answer = await prompt({
    // Map our action objects into enquirer friendly action objects that don't
    // like functions for `value`s...
    choices: _.map(actions, ({message}, index) => ({name: _.toString(index), message})),
    message: 'DNPK Testing Grounds: Main Menu',
    name: 'action',
    type: 'select',
  })

  // ...look up the action function from the response.
  return _.get(actions, `[${answer.action}].next`)
}

// int main(void)
export const main = async ({defaultState = mainMenu} = {}) => {
  await l10n.read()
  await dataSourceGameObjects.read()

  // load any of our specific testing-ground data.
  await dataSourceGame.read()

  // try/catch to handle ctrl-c and other program escapes since enquirer needs
  // to do some flavor of magic to intercept and handle key presses, we don't
  // write our own signal listeners but assume theirs are running since this
  // is mainly a REPL.
  try {
    let next = defaultState
    while (true) {
      console.clear()
      next = await next() || defaultState
    }
  } catch (err) {
    if (!err) {
      // Ctrl-c is a default keybinding, and there is no error thrown, something
      // here is probably the result of a SIGINT equivalent.
      // see: https://github.com/enquirer/enquirer/blob/master/index.d.ts#L12
      // see: https://github.com/enquirer/enquirer#-key-bindings
      out('Exiting...')
    } else {
      // ...else something bad probably happened.
      out('Something happened, terminating. Error:', err)
    }
  }
}

if (require.main === module) {
  main()
}

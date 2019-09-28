//
// For saving files, use https://github.com/sindresorhus/env-paths
//

// import {battle} from 'battle'
import * as configGameObjects from 'config-game-objects'
import {prompt} from 'enquirer'
import * as gameObjects from 'game-objects'
import hitReturnToContinue from './hit-return-to-continue'
import mockBattle from './mock-battle'
import {init as l10nInit, t} from 'l10n'
import _ from 'lodash'
// import * as simulation from 'simulation'
// import * as ui from 'ui'

export const createPlayer = async () => {
  const {empire} = await prompt({
    type: 'select',
    message: 'choose your empire',
    name: 'empire',
    choices: gameObjects.empire.dir().map((empire) => ({name: empire, message: t(empire), value: empire})),
  })

  const {confirmed} = await prompt({
    type: 'confirm',
    initial: true,
    name: 'confirmed',
    message: `Do you wish to rule the empire of ${t(empire)}.`,
  })

  if (confirmed) {
    await hitReturnToContinue(`You now rule ${t(empire)}. Hit return to continue.`)
    //
    // TODO: Store the empire value.
    //
  } else {
    await hitReturnToContinue('Input ignored. Hit return for the main menu.')
  }
}

export const mainMenu = async () => {
  const actions = {
    1: {
      message: 'Make a new player',
      next: createPlayer,
    },
    2: {
      message: 'View current player',
      next: () => console.log('TODO: view current player'),
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
    console.log('something happened, terminating. Error:', err)
  }
}

if (require.main === module) {
  main()
}

import * as dataSourceModdables from 'data-source-moddables'
import {prompt} from 'enquirer'
import * as l10n from 'l10n'
import _ from 'lodash'
import meatGrinder from 'meat-grinder'
import mockBattle from 'mock-battle'
import monteCarlo from 'monte-carlo'
import out from 'out'

const {t} = l10n

export const mainMenu = async () => {
  const actions = [
    {
      message: t('Venture into the meat grinder'),
      next: meatGrinder,
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

//
// Launcher for any program considered to be part of the testing-grounds.
//
// Each choice added to the testing grounds is considered to be a program
// encapsulated in an async function. When it yields the main menu will be
// displayed again until the user quits from the main menu or ctrl-c's from
// a subroutine.
//
export const main = async () => {
  await l10n.read({ns: ['translation']})
  await dataSourceModdables.read()

  // try/catch to handle ctrl-c and other program escapes since enquirer needs
  // to do some flavor of magic to intercept and handle key presses, we don't
  // write our own signal listeners but assume theirs are running since this
  // is mainly a REPL.
  try {
    let next = mainMenu
    while (true) {
      console.clear()
      next = await next() || mainMenu
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

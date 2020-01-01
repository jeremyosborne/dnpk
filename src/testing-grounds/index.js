//
// Launcher for any program considered to be part of the testing-grounds.
//
// Programs must export a `main` function that will be run via `async main()`.
// The program yields control back to the launcher by returning a non-function,
// or by returning a function that will be executed next. Returning a function
// to the launcher by a program should be avoided.
//
// Programs should load/manage their own assets and not assume that the
// launcher has loaded anything.
//
import * as dataSourceModdables from 'data-source-moddables'
import {prompt} from 'enquirer'
import * as l10n from 'l10n'
import _ from 'lodash'
import meatGrinder from 'meat-grinder'
import mockBattle from 'mock-battle'
import monteCarlo from 'monte-carlo'
import out from 'out'

const {t} = l10n

//
// Register programs in `actions` to allow them to be chosen from the main
// menu.
//
export const mainMenu = async () => {
  const actions = [
    {
      message: t('Meat Grinder: an idle clicker for testing various game mechanics and ideas'),
      next: meatGrinder,
    },
    {
      message: t('Monte carlo testing'),
      next: monteCarlo,
    },
    {
      message: t('Mock Battle: a simple battle simulator and console test tool'),
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

export const main = async () => {
  await l10n.read({
    ns: [
      'translation',
      'army',
      'empire',
    ]
  })
  await dataSourceModdables.read()

  // try/catch to handle ctrl-c and other program escapes since enquirer needs
  // to do some flavor of magic to intercept and handle key presses, we don't
  // write our own signal listeners but assume theirs are running since this
  // is mainly a REPL.
  try {
    let next = mainMenu
    while (true) {
      // I'll probably switch this on and off 50 more times as I modify this test tool.
      // console.clear()
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

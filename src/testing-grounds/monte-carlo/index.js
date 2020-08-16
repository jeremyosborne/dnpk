//
// Run-it-a-bunch style of testing.
//
// Aids with functions and code where I don't trust my biased and tunnel visioned style
// of unit testing.
//
import * as dataSourceModdables from 'data-source-moddables'
import * as l10n from 'l10n'
import mainMenu from './main-menu'

export const main = async () => {
  // Load expected data into memory.
  await l10n.read({ns: ['translation', 'army', 'empire']})
  await dataSourceModdables.read()

  let next = mainMenu

  while (next) {
    next = await next()
  }
}

export default main

//
// Launch standalone if invoked from commandline.
//
if (require.main === module) {
  main()
}

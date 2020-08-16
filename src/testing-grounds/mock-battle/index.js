//
// Run a single battle with randomized players and armies, output results,
// and quit.
//
// Intended to test out the battle module, reporting, and basic text output.
//
import * as dataSourceModdables from 'data-source-moddables'
import mockBattle from './mock-battle'
import hitReturnToContinue from 'hit-return-to-continue'
import * as l10n from 'l10n'

export const main = async () => {
  // Load expected data into memory.
  await l10n.read({ns: ['translation', 'army', 'empire']})
  await dataSourceModdables.read()

  mockBattle()

  return hitReturnToContinue()
}

export default main

//
// Launch standalone if invoked from commandline.
//
if (require.main === module) {
  main()
}

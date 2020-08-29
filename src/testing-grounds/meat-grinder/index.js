//
// Cookie clicker, almost-idle test game.
//
// Try out ideas and new rules that diverge from the core Warlords ruleset that
// this game was based on.
//
import * as dataSourceModdables from 'data-source-moddables'
import * as l10n from 'l10n'
import * as dataSourceGame from 'meat-grinder/data-source-game'
import mainMenu from 'meat-grinder/main-menu'

export const main = async () => {
  // Load expected data into memory.
  await l10n.read({
    ns: [
      'translation',
      'army',
      'battle',
      'empire',
      'equippable',
      'meat-grinder',
    ]
  })
  await dataSourceModdables.read()
  // Game has its own datasource that we need to read in at least once.
  await dataSourceGame.read()

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

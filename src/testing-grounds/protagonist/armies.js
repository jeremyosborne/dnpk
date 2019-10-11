import * as dataSourceGame from 'data-source-game'
import {prompt} from 'enquirer'
import * as gameObjects from 'game-objects'
import hitReturnToContinue from 'hit-return-to-continue'
import {t} from 'l10n'
import _ from 'lodash'
import out from 'out'
import * as random from 'random'
import * as ui from 'ui'

export const army = async () => {
  // We assume that you only work with one army.
  let armyGroup = _.get(dataSourceGame.protagonist.get(), 'armyGroups[0]')
  if (armyGroup) {
    out.t('Your current army:')
    ui.text.armyGroup({armyGroup})
  }

  const {confirmed} = await prompt({
    initial: true,
    message: armyGroup ? t('Do you wish to replace your current army?') : t('Do you wish to create an army?'),
    name: 'confirmed',
    type: 'confirm',
  })

  if (confirmed) {
    // There's no raw def ref at the moment, so create throwaway objects that
    // have strength references that we can use to weight the army selection.
    const armies = gameObjects.army.dir()
      .map((name) => gameObjects.army.create({name}))

    armyGroup = random.sampleWeighted({
      choices: armies,
      pick: 8,
      weight: (a) => {
        // Heroes lowest weight.
        if (gameObjects.army.is.hero(a)) {
          return 1
        }
        const strength = gameObjects.army.strength(army)
        // Everything has a higher chance of being picked over a hero.
        return 10 - strength + 2 * (10 - strength)
      }
    }).map((a) => gameObjects.army.create({name: a.name}))

    out.t('army created:')
    ui.text.armyGroup({armyGroup})
    // For now, you only have one army group you are working with.
    dataSourceGame.protagonist.save({armyGroups: [armyGroup]})
    await hitReturnToContinue()
  } else {
    await hitReturnToContinue(t('No changes. Hit return for the main menu.'))
  }
}

export default army

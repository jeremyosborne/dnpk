// import * as dataSourceGame from 'data-source-game'
import {prompt} from 'enquirer'
import * as gameObjects from 'game-objects'
import hitReturnToContinue from 'hit-return-to-continue'
import {t} from 'l10n'
import out from 'out'
import * as random from 'random'
import * as ui from 'ui'

export const army = async () => {
  const {confirmed} = await prompt({
    initial: true,
    message: t('Do you wish to roll a new army?'),
    name: 'confirmed',
    type: 'confirm',
  })

  if (confirmed) {
    // There's no raw def ref at the moment, so create throwaway objects that
    // have strength references that we can use to weight the army selection.
    const armies = gameObjects.army.dir()
      .map((name) => gameObjects.army.create({name}))

    const armyGroup = random.sampleWeighted({
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

    //
    // TODO: this needs some improvement and needs to acdtually save the
    // changes.
    //

    out.t('army created:')
    ui.text.armyGroup({armyGroup})
    await hitReturnToContinue()

    // if (!dataSourceGame.protagonist.exists()) {
    //   dataSourceGame.protagonist.create()
    // } else {
    //   dataSourceGame.protagonist.save({empire})
    // }
    // await hitReturnToContinue(t('You now rule {{empire, commonName}}. Hit return to continue.', {empire}))
  } else {
    await hitReturnToContinue(t('Input ignored. Hit return for the main menu.'))
  }
}

export default army

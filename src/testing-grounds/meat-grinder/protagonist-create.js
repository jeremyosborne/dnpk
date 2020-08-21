import * as dataSourceGame from 'meat-grinder/data-source-game'
import {prompt} from 'enquirer'
import * as gameObjects from 'game-objects'
import hitReturnToContinue from 'hit-return-to-continue'
import {t} from 'l10n'

// Originally protagonist was going to maybe be more special, now it's really
// just empire management, and the one spot where we create the `protagonist`
// data structure.
export const createProtagonist = async () => {
  const protagonist = dataSourceGame.protagonist.get()

  let {empire} = await prompt({
    // Deal with strings only in the prompt, not objects.
    choices: gameObjects.empire.dir().map((empire) => ({name: empire, message: t(empire)})),
    message: !protagonist ? t('Choose your empire')
      : t('Choose a new empire (current empire: {{empire, namingsShort}})', {empire: protagonist.empire}),
    name: 'empire',
    type: 'select',
  })

  // string -> object
  empire = gameObjects.empire.create({name: empire})

  const {confirmed} = await prompt({
    initial: true,
    message: t('Do you wish to rule the empire of {{empire, namingsShort}}?', {empire}),
    name: 'confirmed',
    type: 'confirm',
  })

  if (confirmed) {
    if (!dataSourceGame.protagonist.exists()) {
      dataSourceGame.protagonist.create()
    }
    dataSourceGame.protagonist.save({empire})
    await hitReturnToContinue(t('You now rule {{empire, namingsShort}}. Hit return to continue.', {empire}))
  } else {
    await hitReturnToContinue(t('Input ignored. Hit return for the main menu.'))
  }
}

export default createProtagonist

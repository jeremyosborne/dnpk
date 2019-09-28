//
// For saving files, use https://github.com/sindresorhus/env-paths
//

import {prompt} from 'enquirer'
import * as dataSourceGame from './data-source-game'
import * as gameObjects from 'game-objects'
import hitReturnToContinue from './hit-return-to-continue'
import {t} from 'l10n'
// import _ from 'lodash'

export const createProtagonist = async () => {
  let {empire} = await prompt({
    // Deal with strings only in the prompt, not objects.
    choices: gameObjects.empire.dir().map((empire) => ({name: empire, message: t(empire)})),
    message: t('Choose your empire'),
    name: 'empire',
    type: 'select',
  })

  // string -> object
  empire = gameObjects.empire.create({name: empire})

  const {confirmed} = await prompt({
    initial: true,
    message: t('Do you wish to rule the empire of {{empire, commonName}}?', {empire}),
    name: 'confirmed',
    type: 'confirm',
  })

  if (confirmed) {
    dataSourceGame.protagonist.set({empire})
    await hitReturnToContinue(t('You now rule {{empire, commonName}}. Hit return to continue.', {empire}))
  } else {
    await hitReturnToContinue(t('Input ignored. Hit return for the main menu.'))
  }
}

export default createProtagonist

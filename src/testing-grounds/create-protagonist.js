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
    dataSourceGame.protagonist.set({empire})
    await hitReturnToContinue(`You now rule ${t(empire)}. Hit return to continue.`)
  } else {
    await hitReturnToContinue('Input ignored. Hit return for the main menu.')
  }
}

export default createProtagonist

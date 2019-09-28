//
// For saving files, use https://github.com/sindresorhus/env-paths
//

import * as dataSourceGame from './data-source-game'
import hitReturnToContinue from './hit-return-to-continue'
import {t} from 'l10n'
// import _ from 'lodash'

export const createProtagonist = async () => {
  const protagonist = dataSourceGame.protagonist.get()

  if (protagonist) {
    console.log(t('Protagonist:'))
    console.log(JSON.stringify(protagonist, null, 4))
  } else {
    console.log(t('No protagonist chosen yet.'))
  }

  await hitReturnToContinue()
}

export default createProtagonist

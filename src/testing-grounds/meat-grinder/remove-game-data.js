import * as dataSourceGame from 'meat-grinder/data-source-game'
import {prompt} from 'enquirer'
import hitReturnToContinue from 'hit-return-to-continue'
import {t} from 'l10n'

export const removeGameData = async () => {
  const {confirmed} = await prompt({
    initial: true,
    message: t('Remove current game data?'),
    name: 'confirmed',
    type: 'confirm',
  })

  if (confirmed) {
    await dataSourceGame.remove()
    await hitReturnToContinue(t('Game data successfully removed.'))
  } else {
    await hitReturnToContinue(t('Game data not removed.'))
  }
}

export default removeGameData

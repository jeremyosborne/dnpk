import {prompt} from 'enquirer'
import * as gameRules from 'game-rules'
import hitReturnToContinue from 'hit-return-to-continue'
import {t} from 'l10n'
import _ from 'lodash'
import {settings} from 'meat-grinder/data-source-game'
import out from 'out'

// Modify settings.
export const gameSettings = async () => {
  const {action} = await prompt({
    type: 'select',
    message: t('Game settings'),
    name: 'action',
    choices: [
      {message: t('View data'), name: 'view'},
      {message: t('Set game rules'), name: 'set-game-rules'},
      {message: t('Cancel'), name: 'cancel'},
    ],
  })

  if (action === 'cancel') {
    await hitReturnToContinue(t('No action taken.'))
  }

  if (action === 'set-game-rules') {
    const UNSET_NAME = `UNSET-${Math.random}`
    const {gameRulesName} = await prompt({
      type: 'select',
      message: t('Game rules'),
      name: 'gameRulesName',
      choices: [
        ..._.map(gameRules.dir(), (name) => ({message: name, name})),
        {message: t('Unset (use system default)'), name: UNSET_NAME},
      ],
    })
    if (gameRulesName === UNSET_NAME) {
      // gameRules is a singleton with very limited usage in our testing-grounds. We'll restore whatever
      // the system default here is, too, along with our config setting.
      gameRules.nameDefault.reset()
      settings.save({gameRulesName: ''})
    } else {
      settings.save({gameRulesName})
    }
  }

  if (action === 'view') {
    _.forEach(settings.get(), (value, setting) => {
      out.t('{{setting}}: {{value}}', {setting, value})
      out('')
    })
    await hitReturnToContinue()
  }
}

export default gameSettings

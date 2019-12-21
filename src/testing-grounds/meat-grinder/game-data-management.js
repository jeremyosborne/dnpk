import {prompt} from 'enquirer'
import hitReturnToContinue from 'hit-return-to-continue'
import {t} from 'l10n'
import _ from 'lodash'
import * as dataSourceGame from 'meat-grinder/data-source-game'
import out from 'out'

// View or remove game data.
export const gameDataManagement = async () => {
  const {action} = await prompt({
    type: 'select',
    message: t('Game data management'),
    name: 'action',
    choices: [
      {message: t('View data'), name: 'view'},
      {message: t('Remove data'), name: 'remove'},
    ],
  })

  const choices = [
    ..._.map(dataSourceGame.dataSources, (ds, name) => ({message: t('{{name}} data', {name}), name})),
    {
      message: t('All game data'),
      // Assume all will never be the name of a data source.
      name: 'all',
    },
    {
      message: t('Cancel'),
      // Assume cancel will never be the name of a data source.
      name: 'cancel',
    }
  ]

  const {choice} = await prompt({
    type: 'select',
    message: t('Which data source?'),
    name: 'choice',
    choices,
  })

  if (choice === 'cancel') {
    await hitReturnToContinue(t('No action taken.'))
  }

  if (action === 'view') {
    if (choice === 'all') {
      // Barf into the terminal.
      _.forEach(dataSourceGame.dataSources, (ds, name) => {
        out.t('Data source: {{name}}', {name})
        // Data souces are supposed to implement toJSON.
        out(JSON.stringify(ds, null, 4))
        out('')
      })
      await hitReturnToContinue()
    } else {
      // Selectively barf into the terminal.
      out.t('Data source: {{name}}', {name: choice})
      out(JSON.stringify(dataSourceGame.dataSources[choice], null, 4))
      await hitReturnToContinue()
    }
  } else if (action === 'remove') {
    if (choice === 'all') {
      await dataSourceGame.remove()
      await hitReturnToContinue(t('All game data removed.'))
    } else {
      // Remove specific game data.
      await dataSourceGame.dataSources[choice].remove()
      await hitReturnToContinue(t('{{name}} data removed.', {name: choice}))
    }
  }
}

export default gameDataManagement

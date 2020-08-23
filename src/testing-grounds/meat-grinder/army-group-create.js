import * as dataSourceGame from 'meat-grinder/data-source-game'
import {prompt} from 'enquirer'
import hitReturnToContinue from 'hit-return-to-continue'
import {t} from 'l10n'
import _ from 'lodash'
import out from 'out'
import {createRandomWeightedArmyGroup} from 'simulation'
import * as ui from 'ui'

export const createArmyGroup = async () => {
  // We assume that you only work with one army.
  let armyGroup = _.get(dataSourceGame.protagonist.get(), 'armyGroups[0]')
  if (armyGroup) {
    out.t('Your current army:')
    ui.text.armyGroup.out(armyGroup)
  }

  const {confirmed} = await prompt({
    initial: true,
    message: armyGroup ? t('Do you wish to replace your current army?') : t('Do you wish to create an army?'),
    name: 'confirmed',
    type: 'confirm',
  })

  if (confirmed) {
    let roll = true
    while (roll) {
      armyGroup = createRandomWeightedArmyGroup()
      out.t('army created:')
      ui.text.armyGroup.out(armyGroup)
      const {reroll} = await prompt({
        initial: false,
        message: t('Do you wish to reroll (y) or keep this army (n)?'),
        name: 'reroll',
        type: 'confirm',
      })
      roll = reroll
    }
    dataSourceGame.protagonist.save({armyGroups: [armyGroup]})
    await hitReturnToContinue()
  } else {
    await hitReturnToContinue(t('No changes. Hit return for the main menu.'))
  }
}

export default createArmyGroup

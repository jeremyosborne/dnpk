import * as configGameObjects from 'config-game-objects'
import chalk from 'chalk'
import * as gameObjects from 'game-objects'
import {init as l10nInit, t} from 'l10n'
import _ from 'lodash'
import {sprintf} from 'sprintf-js'

// Temporary view functions.
const showGroup = (group, color, groupStrengthBonus) => console.log(`${chalk[color](group.reduce((info, army) => {
  const effectiveStrength = gameObjects.army.strengthEffective(army)
  info.push(`${sprintf('%-17s', army.name)} ${sprintf('Str: %-3s', army.strength)} (Eff Str: ${effectiveStrength}) (Battle Str: ${Math.min(9, effectiveStrength + groupStrengthBonus)})`)
  return info
}, []).join('\n'))}`)

// int main(void)
Promise.resolve()
  .then(() => {
    // Load string translations.
    return l10nInit()
  })
  .then(() => {
    // Load user configurable entity definitions.
    return configGameObjects.load()
  })
  .then(() => {
    console.log(t('Battle prototype'))

    const armyTypes = gameObjects.army.dir()
    console.log(t('Armies available:'))
    console.log(chalk.yellow(_.sortBy(armyTypes).join('\n')))

    // Create 2 groups of armies.

    console.log('')

    const dadGroup = _.times(4, gameObjects.army.create.random)
    console.log(t('{{empire}} group:', {empire: 'Dad the Dictator'}))
    // Equip heroes with items.
    _.filter(dadGroup, (a) => gameObjects.army.is.hero)
      .forEach((a) => {
        const eq = gameObjects.equippable.create.random()
        console.log(`Equipping ${a.nameInstance || a.name} with ${eq.name}`)
        a.equipment.push(eq)
      })
    const dadGroupStrengthBonus = gameObjects.army.group.strengthBonus(dadGroup)
    console.log(t('Army group bonus: {{bonus}}', {bonus: dadGroupStrengthBonus}))
    showGroup(dadGroup, 'blue', dadGroupStrengthBonus)

    console.log('')

    const archerGroup = _.times(4, gameObjects.army.create.random)
    console.log(t('{{empire}} group:', {empire: 'Archer the Awesome'}))
    // Equip heroes with items.
    _.filter(archerGroup, (a) => gameObjects.army.is.hero)
      .forEach((a) => {
        const eq = gameObjects.equippable.create.random()
        console.log(`Equipping ${a.nameInstance || a.name} with ${eq.name}`)
        a.equipment.push(eq)
      })
    const archerGroupStrengthBonus = gameObjects.army.group.strengthBonus(archerGroup)
    console.log(t('Army group bonus: {{bonus}}', {bonus: archerGroupStrengthBonus}))
    showGroup(archerGroup, 'green', archerGroupStrengthBonus)

    // Engage the 2 groups in battle.

    // Create the attacking group battle structure.

    // Create the defending group battle structure.

    // Run the battle between the groups.

    // Return the battle group structure + statistics.
  })
  .catch((err) => {
    console.error('something broke in the promise chain, have an error:')
    console.error(err)
  })

import * as configGameObjects from 'config-game-objects'
import chalk from 'chalk'
import * as gameObjects from 'game-objects'
import {init as l10nInit, t} from 'l10n'
import _ from 'lodash'
import {sprintf} from 'sprintf-js'

const showGroup = (group, color) => {
  const strengthBonus = gameObjects.army.group.strengthBonus(group)
  console.log(`${chalk[color](t('Army group bonus: {{bonus}}', {bonus: strengthBonus}))}`)
  console.log(`${chalk[color](group.reduce((info, army) => {
    const strengthEffective = gameObjects.army.strengthEffective(army)
    info.push(`${sprintf('%-17s', gameObjects.nameEffective(army))} ${sprintf('Str: %-3s', army.strength)} (Eff Str: ${strengthEffective}) (Battle Str: ${Math.min(9, strengthEffective + strengthBonus)})`)
    return info
  }, []).join('\n'))}`)
}

// mutates object passed in
const heroEquipRandom = (a, color = 'green') => {
  const eq = gameObjects.equippable.create.random()
  console.log(chalk[color](`Equipping ${gameObjects.nameEffective(a)} with ${gameObjects.nameEffective(eq)}`))
  gameObjects.army.do.equip(a, eq)

  return a
}

const empireTitle = (empire) => console.log(chalk[empire.color](t('{{empire.name}}', {empire})))

// int main(void)
export const main = async () => {
  await l10nInit()
  await configGameObjects.load()

  console.log(t('Battle prototype'))

  const armyTypes = gameObjects.army.dir()
  console.log(t('Armies available:'))
  console.log(chalk.yellow(_.sortBy(armyTypes).join('\n')))

  // Create 2 groups of armies.

  console.log('')
  const dadEmpire = {
    color: 'blue',
    name: 'Dad the Dictator',
  }
  const dadGroup = _.times(4, gameObjects.army.create.random)
  empireTitle(dadEmpire)
  // Equip heroes with items.
  _.filter(dadGroup, gameObjects.army.is.hero)
    .forEach((a) => heroEquipRandom(a, 'blue'))
  showGroup(dadGroup, 'blue')

  console.log('')

  const archerEmpire = {
    color: 'red',
    name: 'Archer the Awesome',
  }
  const archerGroup = _.times(4, gameObjects.army.create.random)
  empireTitle(archerEmpire)
  // Equip heroes with items.
  _.filter(archerGroup, gameObjects.army.is.hero)
    .forEach((a) => heroEquipRandom(a, 'red'))
  showGroup(archerGroup, 'red')

  // Engage the 2 groups in battle.

  console.log('\n\n\nBattle commencing between\n')

  // Create the attacking group battle structure.
  const dadGroupBattleCopy = gameObjects.army.group.sort(_.cloneDeep(dadGroup))

  // Create the defending group battle structure.
  const archerGroupBattleCopy = gameObjects.army.group.sort(_.cloneDeep(archerGroup))

  // Run the battle between the groups.
  empireTitle(dadEmpire)
  showGroup(dadGroupBattleCopy, 'blue')
  console.log('vs.')
  empireTitle(archerEmpire)
  showGroup(archerGroupBattleCopy, 'red')

  // Return the battle group structure + statistics.
}

if (require.main === module) {
  main()
}

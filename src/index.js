import {battle} from 'battle'
import * as configGameObjects from 'config-game-objects'
import * as gameObjects from 'game-objects'
import {init as l10nInit, t} from 'l10n'
import * as simulation from 'simulation'
import * as ui from 'ui'

// int main(void)
export const main = async () => {
  await l10nInit()
  await configGameObjects.load()

  console.log(t('Battle prototype'))

  console.log(t('Using ruleset: {{rules}}', {rules: gameObjects.rules.nameDefault()}))

  // const armyTypes = gameObjects.army.dir()
  // console.log(t('Armies available:'))
  // console.log(chalk.yellow(_.sortBy(armyTypes).join('\n')))

  // Create 2 groups of armies and their leaders.

  // Not deduping empires right now. That's fine, we can have infighting.
  const player1 = simulation.create.playerRandom()
  const player2 = simulation.create.playerRandom()
  const terrain = gameObjects.terrain.create.random()

  // Engage the 2 groups in battle.

  console.log(`\nBattle commencing on terrain (${gameObjects.common.name(terrain)}), between:`)
  console.log('')
  ui.text.empire.title(player1)
  ui.text.armyGroup({armyGroup: player1.armyGroups[0]})
  console.log('\nvs.\n')
  ui.text.empire.title(player2)
  ui.text.armyGroup({armyGroup: player2.armyGroups[0]})

  const {
    attackers,
    defenders,
    events: battleEvents,
  } = battle({
    attackers: {
      armyGroup: player1.armyGroups[0],
      empire: player1.empire,
    },
    defenders: {
      armyGroup: player2.armyGroups[0],
      empire: player2.empire,
    },
    terrain,
  })

  console.log('\n\n')

  ui.text.battle.report({attackerColor: player1.empire.color, defenderColor: player2.empire.color, events: battleEvents})

  console.log('\n\n')

  ui.text.battle.results({attackers, defenders})

  console.log('\n\n')
}

if (require.main === module) {
  main()
}

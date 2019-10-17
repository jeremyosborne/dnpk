import {battle} from 'battle'
import * as gameObjects from 'game-objects'
import hitReturnToContinue from 'hit-return-to-continue'
import out from 'out'
import * as simulation from 'simulation'
import * as ui from 'ui'

export const mockBattle = async () => {
  out.t('Mock battle')

  out.t('Using ruleset: {{rules}}', {rules: gameObjects.rules.nameDefault()})

  // Not deduping empires right now. That's fine, we can have infighting.
  const player1 = simulation.create.playerRandom()
  const player2 = simulation.create.playerRandom()
  const terrain = gameObjects.terrain.create.random()

  // Engage the 2 groups in battle.

  out(`\nBattle commencing on terrain (${gameObjects.common.name(terrain)}), between:`)
  out('')
  ui.text.empire.title(player1)
  ui.text.armyGroup({armyGroup: player1.armyGroups[0]})
  out('\nvs.\n')
  ui.text.empire.title(player2)
  ui.text.armyGroup({armyGroup: player2.armyGroups[0]})

  const {
    attackers,
    defenders,
    events,
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

  out('\n\n')

  ui.text.battle.report({attackerColor: player1.empire.color, defenderColor: player2.empire.color, events})

  out('\n\n')

  ui.text.battle.results({attackers, defenders})

  out('\n\n')

  await hitReturnToContinue()
}

export default mockBattle

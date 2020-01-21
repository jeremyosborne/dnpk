import {battle} from 'simulation/battle'
import * as gameObjectsCommon from 'game-objects-common'
import * as gameRules from 'game-rules'
import playerRandom from './player-random'
import out from 'out'
import * as simulation from 'simulation'
import * as ui from 'ui'

/**
 * Run a single battle between two randomized opponents and output results.
 */
export const mockBattle = () => {
  out.t('Mock battle')

  out.t('Using ruleset: {{rules}}', {rules: gameRules.nameDefault()})

  // Not deduping empires right now. That's fine, we can have infighting.
  const player1 = playerRandom()
  const player2 = playerRandom()
  const terrain = simulation.createRandom({type: 'terrain'})

  // Engage the 2 groups in battle.

  out(`\nBattle commencing on terrain (${gameObjectsCommon.name(terrain)}), between:`)
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
}

export default mockBattle

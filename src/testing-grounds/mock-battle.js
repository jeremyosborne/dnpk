import {battle} from 'battle'
import * as gameObjects from 'game-objects'
import hitReturnToContinue from 'hit-return-to-continue'
import _ from 'lodash'
import out from 'out'
import * as simulation from 'simulation'
import * as ui from 'ui'

/**
 * Create a random army.
 *
 * @return {object} an army instance, randomly generated.
 */
export const armyRandom = () => {
  const army = simulation.createRandom({type: 'army'})
  if (gameObjects.army.is.hero(army)) {
    // Equip heroes with an item.
    const equippable = simulation.createRandom({type: 'equippable'})
    gameObjects.army.do.equip({army, equippable})
    // Give a name to the hero.
    army.nameInstance = simulation.randomNaming({name: 'hero'})
  }
  return army
}

/**
 * Create a random player.
 *
 * @param {object} args parameters as associative array
 * @param {number} [args.numberOfArmyGroups=1] how many army groups to create by default.
 * @param {number} [args.armyGroupSize=8] the default size of the groups generated
 * for this player.
 *
 * @return {object} a randomly generated test player.
 */
export const playerRandom = ({
  numberOfArmyGroups = 1,
  armyGroupSize = 8,
} = {}) => {
  const player = gameObjects.player.create()

  player.empire = simulation.createRandom({type: 'empire'})
  player.armyGroups = _.times(numberOfArmyGroups, () => _.times(armyGroupSize, armyRandom))

  return player
}

export const mockBattle = async () => {
  out.t('Mock battle')

  out.t('Using ruleset: {{rules}}', {rules: gameObjects.rules.nameDefault()})

  // Not deduping empires right now. That's fine, we can have infighting.
  const player1 = playerRandom()
  const player2 = playerRandom()
  const terrain = simulation.createRandom({type: 'terrain'})

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

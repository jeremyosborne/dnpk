import * as configGameObjects from 'config-game-objects'
import chalk from 'chalk'
import * as gameObjects from 'game-objects'
import {init as l10nInit, t} from 'l10n'
import _ from 'lodash'
import {d} from 'random'
import * as simulation from 'simulation'
import * as ui from 'ui'

/**
 * Simulate a battle and return the results and battle report.
 *
 * Does not mutate input.
 *
 * @param {object[]} attackers an army-group
 * @param {object} attackerPlayer player attackers are associated with, needed
 * for empire reference.
 * @param {object[]} defenders an army-group
 * @param {object} defenderPlayer player defenders are associated with, needed
 * for empire reference.
 *
 * @return {object} outcome and a battle report delivered as a list of events.
 */
const battle = ({attackers, attackerPlayer, defenders, defenderPlayer}) => {
  // Clone the attacking and defending groups. Battle can mutate the objects, but reports/events
  // out the results. The caller is responsible for handling the results of the
  // battle and applying permanent changes. Ideally this allows for a later rules
  // extensions where battle "kills" can be translated to "downed" or "injured"
  // or "captured" or "routed" units.
  attackers = gameObjects.armyGroup.sort(_.cloneDeep(attackers))
  defenders = gameObjects.armyGroup.sort(_.cloneDeep(defenders))

  // While both groups still have units, keep going.
  const attackerCasualties = []
  const defenderCasualties = []
  // What happened during this battle.
  const events = []
  while (attackers.length && defenders.length) {
    // Top of the stack current battle.
    const attacker = attackers[0]
    const attackerStrength = gameObjects.rules.strengthBounded(gameObjects.armyGroup.strengthModifier(attackers) + gameObjects.army.strength(attacker))
    const defender = defenders[0]
    const defenderStrength = gameObjects.rules.strengthBounded(gameObjects.armyGroup.strengthModifier(defenders) + gameObjects.army.strength(defender))

    events.push({
      attacker: {
        ref: _.clone(attacker),
        health: attacker.health,
        strength: attackerStrength,
      },
      defender: {
        ref: _.clone(defender),
        health: defender.health,
        strength: defenderStrength,
      },
      name: 'battle-round-start',
      type: 'event'
    })

    while (attacker.health && defender.health) {
      const attackerRoll = d.standard()
      const attackerHit = attackerRoll > defenderStrength
      const defenderRoll = d.standard()
      const defenderHit = defenderRoll > attackerStrength

      if ((attackerHit && defenderHit) || (!attackerHit && !defenderHit)) {
        // With these classic mechanic assumptions, each round can only ever have
        // 3 outcomes: a draw, attacker damages defender for 1 health, defender
        // damages attacker for 1 health.
        // No simultaneous damage. If we want to expand the rules, the attacker
        // and defender event metadata will probably also need to be expanded
        // and the event types should probably become more generically named.
        events.push({
          attacker: {
            ref: _.clone(attacker),
            health: attacker.health,
            roll: attackerRoll,
            strength: attackerStrength,
          },
          defender: {
            ref: _.clone(defender),
            health: defender.health,
            roll: defenderRoll,
            strength: defenderStrength,
          },
          name: 'battle-round-no-damage',
          type: 'event'
        })
      } else if (attackerHit) {
        defender.health -= 1
        events.push({
          attacker: {
            ref: _.clone(attacker),
            health: attacker.health,
            roll: attackerRoll,
            strength: attackerStrength,
          },
          defender: {
            ref: _.clone(defender),
            health: defender.health,
            roll: defenderRoll,
            strength: defenderStrength,
          },
          name: 'battle-round-advantage-attacker',
          type: 'event'
        })
      } else {
        attacker.health -= 1
        events.push({
          attacker: {
            ref: _.clone(attacker),
            health: attacker.health,
            roll: attackerRoll,
            strength: attackerStrength,
          },
          defender: {
            ref: _.clone(defender),
            health: defender.health,
            roll: defenderRoll,
            strength: defenderStrength,
          },
          name: 'battle-round-advantage-defender',
          type: 'event'
        })
      }
    }

    if (attacker.health <= 0) {
      attackerCasualties.push(attackers.shift())
      events.push({
        attacker: {
          ref: _.clone(attacker),
          health: attacker.health,
          strength: attackerStrength,
        },
        defender: {
          ref: _.clone(defender),
          health: defender.health,
          strength: defenderStrength,
        },
        name: 'battle-round-win-defender',
        type: 'event'
      })
    }
    if (defender.health <= 0) {
      defenderCasualties.push(defenders.shift())
      events.push({
        attacker: {
          ref: _.clone(attacker),
          health: attacker.health,
          strength: attackerStrength,
        },
        defender: {
          ref: _.clone(defender),
          health: defender.health,
          strength: defenderStrength,
        },
        name: 'battle-round-win-attacker',
        type: 'event'
      })
    }
  }

  return {
    attackerCasualties,
    attackerPlayer,
    attackers,
    defenderCasualties,
    defenderPlayer,
    defenders,
    events,
  }
}

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

  // Engage the 2 groups in battle.

  console.log('\nBattle commencing between\n')

  // Who is fighting who.
  console.log(ui.text.empire.title(player1))
  console.log(chalk.hex(player1.empire.color)(ui.text.armyGroup(player1.armyGroups[0])))
  console.log('\nvs.\n')
  console.log(ui.text.empire.title(player2))
  console.log(chalk.hex(player2.empire.color)(ui.text.armyGroup(player2.armyGroups[0])))

  const {
    attackers,
    attackerCasualties,
    defenders,
    defenderCasualties,
    events: battleEvents,
  } = battle({
    attackers: player1.armyGroups[0],
    attackerPlayer: player1,
    defenders: player2.armyGroups[0],
    defenderPlayer: player2,
  })

  console.log(ui.text.battleReport({attackerPlayer: player1, defenderPlayer: player2, events: battleEvents}))

  console.log('\n\nBattle Results!')

  const casualtyReport = ({survivors, casualties}) => {
    console.log(`# casualties: ${casualties.length}: ${_.map(casualties, (a) => gameObjects.common.name(a)).join(', ')}`)
    console.log(`# in group remaining: ${survivors.length}: ${_.map(survivors, (a) => gameObjects.common.name(a)).join(', ')}`)
  }

  // Here attackers and defenders are the mutated copies of the group, not the original.
  console.log(ui.text.empire.title(player1))
  casualtyReport({survivors: attackers, casualties: attackerCasualties})
  console.log(ui.text.empire.title(player2))
  casualtyReport({survivors: defenders, casualties: defenderCasualties})

  if (attackers.length) {
    console.log(`The ${chalk.hex(player1.empire.color)(player1.empire.name)} empire wins the battle!`)
  } else if (defenders.length) {
    console.log(`The ${chalk.hex(player2.empire.color)(player2.empire.name)} empire wins the battle!`)
  } else {
    console.log("All armies are dead. This shouldn't be possible to reach.")
  }

  // TODO: merge the results of the battle back into the source of truth for the players.
}

if (require.main === module) {
  main()
}

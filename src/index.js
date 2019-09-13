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
 * @param {object} attackers data for the aggressors.
 * @param {object[]} attackers.armyGroup the aggressors armies.
 * @param {object} attackers.empire aggressor empire.
 * @param {object} defenders data for the defenders.
 * @param {object[]} defenders.armyGroup the defending units.
 * @param {object} defenders.empire the defending empire.
 *
 * @return {object} outcome and a battle report delivered as a list of events.
 * @property {object} attackers clone of the argument.
 * @property {object[]} attackers.armyGroup reference to the army group passed in.
 * @property {object[]} attackers.casualties copies of army units destroyed.
 * @property {object} attackers.empire reference to the empire passsed in.
 * @property {object[]} attackers.survivors copies of army units that have survived the battle.
 * @property {object} defenders clone of the argument.
 * @property {object[]} defenders.armyGroup reference to the army group passed in.
 * @property {object[]} defenders.casualties copies of army units destroyed.
 * @property {object} defenders.empire reference to the empire passsed in.
 * @property {object[]} defenders.survivors copies of army units that have survived the battle.
 * @property {object[]} events play by play of the battle for humans or things that like data events.
 */
const battle = ({attackers, defenders}) => {
  // Clone the attacking and defending object...
  attackers = _.clone(attackers)
  defenders = _.clone(defenders)
  // ...and then clone the army groups so we can mutate them into the final results
  // returned. The caller is responsible for committing the results or ignoring
  // them. Ideally this allows for a later rules extensions where battle "kills"
  // can be translated to "downed" or "injured" or "captured" or "routed" units.
  // A bit morbid, but allows our cloned input to just become output as anyone
  // not dead is a survior.
  attackers.survivors = gameObjects.armyGroup.sort(_.cloneDeep(attackers.armyGroup))
  attackers.casualties = []
  defenders.survivors = gameObjects.armyGroup.sort(_.cloneDeep(defenders.armyGroup))
  defenders.casualties = []
  // Track What happened during this battle.
  const events = []

  // While both groups still have units, keep going.
  while (attackers.survivors.length && defenders.survivors.length) {
    // Top of the stack current battle.
    const attacker = attackers.survivors[0]
    // Calculate strength modifier from the original group, which should not
    // be modified during battle.
    const attackerStrength = gameObjects.rules.strengthBounded(gameObjects.armyGroup.strengthModifier(attackers.armyGroup) + gameObjects.army.strength(attacker))
    const defender = defenders.survivors[0]
    const defenderStrength = gameObjects.rules.strengthBounded(gameObjects.armyGroup.strengthModifier(defenders.armyGroup) + gameObjects.army.strength(defender))

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
      // Shift out your dead.
      attackers.casualties.push(attackers.survivors.shift())
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
      defenders.casualties.push(defenders.survivors.shift())
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
    attackers,
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
    }
  })

  console.log(ui.text.battleReport({attackerColor: player1.empire.color, defenderColor: player2.empire.color, events: battleEvents}))

  console.log('\n\n' + t('Battle Results!'))

  console.log(ui.text.battleResults({attackers, defenders}))
}

if (require.main === module) {
  main()
}

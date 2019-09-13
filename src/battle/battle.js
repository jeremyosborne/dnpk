import * as gameObjects from 'game-objects'
import _ from 'lodash'
import {d} from 'random'

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
export const battle = ({attackers, defenders}) => {
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

export default battle

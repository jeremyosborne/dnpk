import * as gameObjects from 'game-objects'
import _ from 'lodash'
import {d as _d} from 'random'

/**
 * Simulate a battle and return the results.
 *
 * Does not mutate input. Caller must commit te results of the battle to the
 * game state.
 *
 * Terminology that follows is based on the assumption of the classic rule set:
 *
 * - A full `battle` is between two army groups that starts by calling this
 * function and ends when one side has been obliterated by the other.
 * - A `battle:round` is a one-on-one fight between two opposing units. A `battle`
 * is made up of as many `battle:round`s as needed to determine the victor, and
 * a `battle:round` lasts until one army has been killed (simultaneous death
 * should be impossible in the classic rule set).
 *
 * @param {object} args as dictionary
 * @param {object} args.attackers data for the aggressors.
 * @param {object[]} args.attackers.armyGroup the aggressors armies.
 * @param {object} args.attackers.empire aggressor empire.
 * @param {object} args.defenders data for the defenders.
 * @param {object[]} args.defenders.armyGroup the defending units.
 * @param {object} args.defenders.empire the defending empire.
 * @param {object} args.terrain where the battle is taking place.
 *
 * @param {object} config as dictionary
 * @param {function} config.nd implements dice with required `d.standard()` method.
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
 * @property {object} terrain reference to the terrain argument.
 */
export const battle = ({attackers, defenders, terrain}, {d = _d} = {}) => {
  // Clone the attacking and defending object...
  attackers = _.cloneDeep(attackers)
  defenders = _.cloneDeep(defenders)
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
    const attackerStrength = gameObjects.common.strength({
      army: attacker,
      armyGroup: attackers.armyGroup,
      empire: attackers.empire,
      terrain,
    })
    const defender = defenders.survivors[0]
    const defenderStrength = gameObjects.common.strength({
      army: defender,
      armyGroup: defenders.armyGroup,
      empire: defenders.empire,
      terrain,
    })

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
      name: 'battle:round:start',
      type: 'event'
    })

    while (attacker.health && defender.health) {
      // Each round has some level of violence. The violence might not lead to
      // an injury on an army, but it is violence.
      // The violence continues until morale improves... I mean someone has
      // no health.

      const attackerRoll = d.standard()
      const attackerHit = attackerRoll > defenderStrength
      const defenderRoll = d.standard()
      const defenderHit = defenderRoll > attackerStrength

      // With these classic mechanic assumptions, each round can only ever have
      // 3 outcomes: a draw, attacker damages defender for 1 health, defender
      // damages attacker for 1 health.
      // No simultaneous damage. If we want to expand the rules, the attacker
      // and defender event metadata will probably also need to be expanded
      // and the event types should probably become more generically named.
      if (attackerHit && !defenderHit) {
        defender.health -= 1
      } else if (!attackerHit && defenderHit) {
        attacker.health -= 1
      }

      events.push({
        attacker: {
          ref: _.clone(attacker),
          damaged: !(attackerHit && !defenderHit),
          health: attacker.health,
          roll: attackerRoll,
          strength: attackerStrength,
        },
        defender: {
          ref: _.clone(defender),
          damaged: !(!attackerHit && defenderHit),
          health: defender.health,
          roll: defenderRoll,
          strength: defenderStrength,
        },
        name: 'battle:round:violence',
        type: 'event'
      })
    }

    // The round is over. Someone has died, and we ~bring~ shift out the dead
    // survivors into the casualties before starting the next round.
    if (attacker.health <= 0) {
      attackers.casualties.push(attackers.survivors.shift())
    } else if (defender.health <= 0) {
      defenders.casualties.push(defenders.survivors.shift())
    }
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
      name: 'battle:round:end',
      type: 'event'
    })
  }

  return {
    attackers,
    defenders,
    events,
  }
}

export default battle

import * as gameObjectsCommon from 'game-objects-common'
import _ from 'lodash'
import {d as _d} from 'random'
import strength from 'simulation/strength'

/**
 * Calculate the results of violence between two units.
 *
 * This function determines who has hit who and who has damaged who.
 *
 * @param {object} args
 * @param {object} args.attacker assumed `army` like object, must implement `.strength`.
 * @param {object} args.defender assumed `army` like object, must implement `.strength`.
 *
 * @param {object} config as dictionary
 * @param {function} config.d the die to use for combat. Classic rules indicate
 * a `standard` die.
 *
 * @return {object} results of the violence, returning `attacker` and `defender`
 * objects containing the raw value that the army `roll`ed, whether that roll
 * constituted a `hit` against the opposition, and whether or not the army is
 * `damaged` due to the violence,
 */
export const violence = ({
  attacker,
  defender,
}, {
  d = _d.standard,
} = {}) => {
  const results = {
    attacker: {
      roll: d(),
      damaged: false,
    },
    defender: {
      roll: d(),
      damaged: false,
    }
  }

  results.attacker.hit = results.attacker.roll > defender.strength
  results.defender.hit = results.defender.roll > attacker.strength

  // With these classic mechanic assumptions, each round can only ever have
  // 3 outcomes:
  //
  // - attacker damages defender (for 1 health)
  // - defender damages attacker (for 1 health)
  // - a draw, no damage
  //
  // No simultaneous damage in classic rules.
  if (results.attacker.hit && !results.defender.hit) {
    results.defender.damaged = true
  } else if (!results.attacker.hit && results.defender.hit) {
    results.attacker.damaged = true
  }

  return results
}

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
 * @param {object|object[]} args.attackers.armyGroup the aggressors armies, which
 * can be in an object that implements `armies` or can be a simple array of
 * `army` types.
 * @param {object} args.attackers.empire aggressor empire.
 * @param {object} args.defenders data for the defenders.
 * @param {object|object[]} args.defenders.armyGroup the defending units, which
 * can be in an object that implements `armies` or can be a simple array of
 * `army` types.
 * @param {object} args.defenders.empire the defending empire.
 * @param {object} args.terrain where the battle is taking place.
 *
 * @param {object} config as dictionary
 * @param {function} config.d the die to use for combat. Classic rules indicate
 * a `standard` die.
 *
 * @return {object} outcome and a battle report delivered as a list of events.
 * @property {object} attackers clone of the argument.
 * @property {object|object[]} attackers.armyGroup reference to the army group passed in.
 * @property {object[]} attackers.casualties copies of army units destroyed.
 * @property {object} attackers.empire reference to the empire passsed in.
 * @property {object[]} attackers.survivors copies of army units that have survived the battle.
 * @property {object} defenders clone of the argument.
 * @property {object|object[]} defenders.armyGroup reference to the army group passed in.
 * @property {object[]} defenders.casualties copies of army units destroyed.
 * @property {object} defenders.empire reference to the empire passsed in.
 * @property {object[]} defenders.survivors copies of army units that have survived the battle.
 * @property {object[]} events play by play of the battle for humans or things that like data events.
 * @property {object} terrain reference to the terrain argument.
 */
export const battle = ({attackers, defenders, terrain}, {d = _d.standard} = {}) => {
  // Clone the attacking and defending object...
  attackers = _.cloneDeep(attackers)
  defenders = _.cloneDeep(defenders)
  // ...and then clone the army groups so we can mutate them into the final results
  // returned. The caller is responsible for committing the results or ignoring
  // them. Ideally this allows for a later rules extensions where battle "kills"
  // can be translated to "downed" or "injured" or "captured" or "routed" units.
  // A bit morbid, but allows our cloned input to just become output as anyone
  // not dead is a survior.
  attackers.survivors = gameObjectsCommon.armies.sort(gameObjectsCommon.armies.get(attackers.armyGroup))
  attackers.casualties = []
  defenders.survivors = gameObjectsCommon.armies.sort(gameObjectsCommon.armies.get(defenders.armyGroup))
  defenders.casualties = []
  // Track What happened during this battle.
  const events = []

  // While both groups still have units, keep going.
  while (attackers.survivors.length && defenders.survivors.length) {
    // Top of the stack current battle.
    const attacker = attackers.survivors[0]
    // Calculate strength modifier from the original group, which should not
    // be modified during battle.
    const attackerStrength = strength({
      army: attacker,
      armyGroup: attackers.armyGroup,
      empire: attackers.empire,
      terrain,
    })
    const defender = defenders.survivors[0]
    const defenderStrength = strength({
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
      const {
        attacker: attackerResults,
        defender: defenderResults,
      } = violence({attacker, defender}, {d})

      if (attackerResults.damaged) {
        attacker.health -= 1
      }
      if (defenderResults.damaged) {
        defender.health -= 1
      }

      events.push({
        attacker: {
          // Provides `damaged`, `hit`, `roll`
          ...attackerResults,
          health: attacker.health,
          ref: _.clone(attacker),
          strength: attackerStrength,
        },
        defender: {
          // Provides `damaged`, `hit`, `roll`
          ...defenderResults,
          health: defender.health,
          ref: _.clone(defender),
          strength: defenderStrength,
        },
        name: 'battle:round:violence',
        type: 'event'
      })
    }

    // The round is over. Someone has died, and we ~bring~ shift out the dead
    // from survivors into the casualties before starting the next round.
    if (attacker.health <= 0) {
      attackers.casualties.push(attackers.survivors.shift())
    }
    if (defender.health <= 0) {
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

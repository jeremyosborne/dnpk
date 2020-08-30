import * as dice from './dice'
import * as gameObjectsCommon from 'game-objects-common'
import _ from 'lodash'
import health from 'simulation/health'
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
  d = dice.standard,
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
 * - A `battle` is made up of as many `battle:round`s as needed to determine the
 * victor.
 * - A `battle:round` is a one-on-one fight between two opposing units. It lasts
 * until one army has been killed.
 * - A `battle:round` consists of:
 *     - one `battle:round:start` event
 *     - N number of `battle:round:violence` events
 *     - one `battle:round:end` event
 *
 * @param {object} args as dictionary
 * @param {object} args.attackers data for the aggressors.
 * @param {object|object[]} args.attackers.armyGroup the aggressors armies, which
 * can be in an object that implements `armies` or can be a simple array of
 * `army` types.
 * @param {object} args.attackers.empire aggressor empire.
 * @param {object[]} args.defenders.structures structures affecting only the attackers.
 * @param {object[]} args.attackers.terrains terrain affecting only the attackers.
 *
 * @param {object} args.defenders data for the defenders.
 * @param {object|object[]} args.defenders.armyGroup the defending units, which
 * can be in an object that implements `armies` or can be a simple array of
 * `army` types.
 * @param {object} args.defenders.empire the defending empire.
 * @param {object[]} args.defenders.structures structures affecting only the defenders.
 * @param {object[]} args.defenders.terrains terrain affecting only the defenders.
 *
 * @param {object[]} args.structures structures on the battlefield affecting both attackers and defenders.
 * @param {object[]} args.terrains terrain affecting both the attackers and defenders.
 *
 * @param {object} config as dictionary
 * @param {function} [config.d] the die to use for combat. Classic rules indicate
 * a `standard` die.
 * @param {boolean} [eventRecording=true] false if you only want the results of the battle
 * and no log of events.
 * @param {number} [violenceMax=Infinity] set if you wish to error out at some maximum number
 * of fight iterations, where an iteration is one while loop of violence.
 *
 * @return {object} outcome and a battle report delivered as a list of events.
 * @property {object} attackers clone of the argument.
 * @property {object|object[]} attackers.armyGroup reference to the army group passed in.
 * @property {object[]} attackers.casualties copies of army units destroyed.
 * @property {object} attackers.empire reference to the empire passsed in.
 * @property {object[]} attackers.survivors copies of army units that have survived the battle.
 * @property {object[]} attackers.structures copies of structures affecting only the attackers.
 * @property {object[]} attackers.terrains copies terrain affecting only the attackers.
 * @property {object} defenders clone of the argument.
 * @property {object|object[]} defenders.armyGroup reference to the army group passed in.
 * @property {object[]} defenders.casualties copies of army units destroyed.
 * @property {object} defenders.empire reference to the empire passsed in.
 * @property {object[]} defenders.structures copies of structures affecting only the defenders.
 * @property {object[]} defenders.survivors copies of army units that have survived the battle.
 * @property {object[]} defenders.terrains copies terrain affecting only the defenders.
 * @property {object[]} events play by play of the battle.
 * @property {object} structures reference to the structure argument.
 * @property {object} terrains reference to the terrain argument.
 */
export const battleGenerator = function * (
  {attackers, defenders, structures = [], terrains = []},
  // violence() protects itself from a missing die, no need to define here.
  {d, eventRecording = true, violenceMax = Infinity} = {},
) {
  // Battle only works with clones of incoming data.
  // The caller is responsible for committing the results of the battle.
  // Perhaps this allows for a later rules extensions where battle "kills"
  // can be translated to "downed" or "injured" or "captured" or "routed" units.
  attackers = _.cloneDeep(attackers)
  attackers.casualties = []
  attackers.structures = attackers.structures || []
  attackers.survivors = gameObjectsCommon.armies.sort(gameObjectsCommon.armies.get(attackers.armyGroup))
  attackers.terrains = attackers.terrains || []
  defenders = _.cloneDeep(defenders)
  defenders.casualties = []
  defenders.structures = defenders.structures || []
  defenders.survivors = gameObjectsCommon.armies.sort(gameObjectsCommon.armies.get(defenders.armyGroup))
  defenders.terrains = defenders.terrains || []

  // While both groups still have units, keep going.
  let attacker
  let defender
  let violenceCount = 0
  while (attackers.survivors.length && defenders.survivors.length) {
    // `attacker` and `defender` battle structures are null at the beginning of a battle
    // and nullified if they become a casualty.
    if (!attacker) {
      const army = attackers.survivors[0]
      // attacker/defender structures used in battle are mutable, although are serialized into
      // event output.
      attacker = {
        // Ref is read only and a clone of the army structure as it was upon entering battle.
        ref: army,
        // Calculate strength and health modifier based on the original group, not the
        // dwindling group as the sides take casualties.
        // Strength and health are mutable during the battle.
        health: health({
          army,
          armyGroup: attackers.armyGroup,
          structures: _.concat(structures, attackers.structures)
        }),
        strength: strength({
          army,
          armyGroup: attackers.armyGroup,
          empire: attackers.empire,
          structures: _.concat(structures, attackers.structures),
          terrains: _.concat(terrains, attackers.terrains),
        }),
      }
    }

    if (!defender) {
      const army = defenders.survivors[0]
      defender = {
        ref: army,
        health: health({
          army,
          armyGroup: defenders.armyGroup,
          structures: _.concat(structures, defenders.structures)
        }),
        strength: strength({
          army,
          armyGroup: defenders.armyGroup,
          empire: defenders.empire,
          structures: _.concat(structures, defenders.structures),
          terrains: _.concat(terrains, defenders.terrains),
        }),
      }
    }

    if (eventRecording) {
      yield {
        attacker: {
          ...attacker,
        },
        defender: {
          ...defender,
        },
        name: 'battle:round:start',
        type: 'event'
      }
    }

    while (attacker.health && defender.health) {
      // Each round has some level of violence. The violence might not lead to
      // an injury on an army, but it is violence.
      // The violence continues until morale improves... I mean someone has
      // no health.
      const {
        attacker: attackerResults,
        defender: defenderResults,
      } = violence({
        attacker,
        defender,
      }, {d})

      if (attackerResults.damaged) {
        attacker.health -= 1
      }
      if (defenderResults.damaged) {
        defender.health -= 1
      }

      if (eventRecording) {
        yield {
          attacker: {
            ...attacker,
            // Provides `damaged`, `hit`, `roll`
            ...attackerResults,
          },
          defender: {
            ...defender,
            // Provides `damaged`, `hit`, `roll`
            ...defenderResults,
          },
          name: 'battle:round:violence',
          type: 'event'
        }
      }

      if (violenceCount >= violenceMax) {
        throw new Error(`battle lasted ${violenceCount} violence rounds, longer than ${violenceMax}, possibly an infinite loop or stalemate battle.`)
      }
      violenceCount += 1
    }

    // The round is over. Someone has died, move the dead to the list of causalties.
    if (eventRecording) {
      yield {
        attacker: {
          ...attacker,
        },
        defender: {
          ...defender,
        },
        name: 'battle:round:end',
        type: 'event'
      }
    }
    if (attacker.health <= 0) {
      attackers.casualties.push(attackers.survivors.shift())
      attacker = null
    }
    if (defender.health <= 0) {
      defenders.casualties.push(defenders.survivors.shift())
      defender = null
    }
  }

  yield {
    attackers,
    defenders,
    structures,
    terrains,
  }
}

// See battlegenerator docs.
export const battle = (...args) => {
  // Play by play of battle.
  const events = []
  for (const event of battleGenerator(...args)) {
    events.push(event)
  }
  // Mirrors the original way of reporting out battle results.
  // Even without eventing, the last event will be a set of structures containing
  // the results of the battle.
  const lastEvent = events.pop()
  return {
    ...lastEvent,
    events,
  }
}

export default battle

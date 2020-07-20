import * as battleState from './battle-state'
import {strength} from 'simulation/strength'
import {violence} from './violence'

/**
 * Simulate a battle and return the results.
 *
 * See documentation in accompanying `README.md`.
 *
 * @param {object} args as dictionary
 * @param {object} args.attackers data for the aggressors.
 * @param {object|object[]} args.attackers.armyGroup the aggressors armies, which
 * can be in an object that implements `armies` or can be a simple array of
 * `army` types.
 * @param {object} args.attackers.empire aggressor empire.
 * @param {object[]} args.attackers.structures specific to the defenders.
 * @param {object[]} args.attackers.terrains specific to the defenders.
 * @param {object} args.defenders data for the defenders.
 * @param {object|object[]} args.defenders.armyGroup the defending units, which
 * can be in an object that implements `armies` or can be a simple array of
 * `army` types.
 * @param {object} args.defenders.empire the defending empire.
 * @param {object[]} args.defenders.structures specific to the defenders.
 * @param {object[]} args.defenders.terrains specific to the defenders.
 * @param {object[]} args.structures general, applies to attackers and defenders.
 * @param {object[]} args.terrains general, applies to attackers and defenders.
 *
 * @param {object} config as dictionary
 * @param {function} [config.d] the die to use for combat.
 * @param {boolean} [config.eventable] will yield events on every event if true, else
 * will only return the final battle state value.
 *
 * @return {object} the final battleState of the battle.
 */
export function * battle (
  {attackers, defenders, structures = [], terrains = []},
  // violence() protects itself from a missing die, pass overrides only.
  {d, eventable = true} = {},
) {
  const state = battleState.create({attackers, defenders, structures, terrains})

  //
  // TODO: strength calculations, state updates, sorting
  //

  if (eventable) {
    yield {
      type: 'event',
      name: 'battle:start',
      state,
    }
  }

  // While both groups still have units, keep going.
  while (state.attackers.survivors.length && state.defenders.survivors.length) {
    // Top of the stack current battle.
    const attacker = state.attackers.survivors[0]

    //
    // REMOVE: The following strength calculations should have already been performed
    // above in the new code.
    //
    // Calculate strength modifier from the original group, which should not
    // be modified during battle.
    const attackerStrength = strength({
      army: attacker,
      armyGroup: state.attackers.armyGroup,
      empire: state.attackers.empire,
      structures,
      terrains,
    })

    const defender = state.defenders.survivors[0]
    const defenderStrength = strength({
      army: defender,
      armyGroup: state.defenders.armyGroup,
      empire: state.defenders.empire,
      structures,
      terrains,
    })

    if (eventable) {
      yield {
        type: 'event',
        name: 'battle:round:start',

        state,

        attacker: {
          battleArmy: attacker,
          id: attacker.army.id,
          // Adheres to battle round event structure, but meaningless in this event.
          damaged: false,
          hit: false,
          roll: 0,
        },

        defender: {
          battleArmy: defender,
          id: defender.army.id,
          // Adheres to battle round event structure, but meaningless in this event.
          damaged: false,
          hit: false,
          roll: 0,
        }
      }
    }

    // TODO: Guard against infinite loops due to bad boundary setting.
    while (attacker.health > 0 && defender.health > 0) {
      // Each round has some level of violence. The violence might not lead to
      // an injury on an army, but it is violence.
      // The violence continues until morale improves... I mean someone has
      // no health.
      const {
        attacker: attackerResults,
        defender: defenderResults,
      } = violence({
        attacker: {strength: attackerStrength},
        defender: {strength: defenderStrength},
      }, {d})

      if (attackerResults.damaged) {
        attacker.health -= 1
      }
      if (defenderResults.damaged) {
        defender.health -= 1
      }

      if (eventable) {
        yield {
          type: 'event',
          name: 'battle:round:violence',

          state,

          attacker: {
            battleArmy: attacker,
            id: attacker.army.id,
            // Provides `damaged`, `hit`, `roll`
            ...attackerResults,
          },

          defender: {
            battleArmy: defender,
            id: defender.army.id,
            // Provides `damaged`, `hit`, `roll`
            ...defenderResults,
          }
        }
      }
    }

    // The round is over. Someone has died, and we ~bring~ shift out the dead
    // from survivors into the casualties before starting the next round.
    if (attacker.health <= 0) {
      state.attackers.casualties.push(state.attackers.survivors.shift())
    }
    if (defender.health <= 0) {
      state.defenders.casualties.push(state.defenders.survivors.shift())
    }

    if (eventable) {
      yield {
        type: 'event',
        name: 'battle:round:end',

        state,

        attacker: {
          battleArmy: attacker,
          id: attacker.army.id,
          // Adheres to battle round event structure, but meaningless in this event.
          damaged: false,
          hit: false,
          roll: 0,
        },

        defender: {
          battleArmy: defender,
          id: defender.army.id,
          // Adheres to battle round event structure, but meaningless in this event.
          damaged: false,
          hit: false,
          roll: 0,
        }
      }
    }
  }

  // This packages up references to original objects as well as battle only
  // structures needed for reporting.
  // Final state describes winner (survivors.length > 0) and loser (survivors.length === 0).
  return state
}

export default battle

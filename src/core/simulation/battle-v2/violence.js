import * as dice from './dice'

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

export default violence

import _ from 'lodash'

/**
 * Common effects reducer, assuming we treat all of these effects the same and
 * sum up the `.mangitude` of the effect.
 *
 * @param {object[]} effects array of effect types where the magnitude is
 * singificant.
 *
 * @return {number} the sum
 */
const sumEffects = (effects) => _.reduce(effects, (modifier, effect) => {
  return modifier + (effect.magnitude || 0)
}, 0)

/**
 * Calculate the strength modifier from `effect`s possessed by armies that
 * have `brawn`.
 *
 * This strength modifier is historically applied to just the army and isn't
 * equivalent to strength-modifiers applied to a full army-group.
 *
 * @param {object} args
 * @param {array} args.effects list of effects
 *
 * @return {number} a strength-modifier or 0
 */
export const strengthModifierBrawn = ({effects}) => {
  let strength = 0
  if (effects && effects.length) {
    effects = _.filter(effects, (effect) => effect.name === 'brawn')
    strength += sumEffects(effects)
  }
  return strength
}

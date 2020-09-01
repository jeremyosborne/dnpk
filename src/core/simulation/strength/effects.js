import _ from 'lodash'

/**
 * Common effects reducer, assuming we treat all of these effects the same and
 * sum up the `.mangitude` of the effect.
 *
 * @param {object[]} effects array of effect types where the magnitude is
 * singificant.
 * @param {string} name name match of the effect to sum.
 *
 * @return {number} the sum
 */
const sumEffectsByName = (effects, name) => _.reduce(effects, (modifier, effect) => {
  if (effect.name === name) {
    modifier += effect.magnitude || 0
  }
  return modifier
}, 0)

/**
 * Calculate the strength modifier from `effect`s possessed that have `brawn`.
 *
 * This strength modifier is historically applied to just the army and isn't
 * equivalent to strength-modifiers applied to a full army-group.
 *
 * @param {object} args
 * @param {array} args.effects list of effects
 *
 * @return {number} a strength-modifier or 0
 */
export const strengthModifierBrawn = ({effects = []} = {}) => {
  return sumEffectsByName(effects, 'brawn')
}

/**
 * Calculate the strength modifier from `effect`s possessed that have `brawn-aura`.
 *
 * This strength modifier is historically shared with everyone in an army-group.
 *
 * @param {object} args
 * @param {array} args.effects list of effects
 *
 * @return {number} a strength-modifier or 0
 */
export const strengthModifierBrawnAura = ({effects = []} = {}) => {
  return sumEffectsByName(effects, 'brawn-aura')
}

/**
 * Calculate the strength modifier from `effect`s possessed that have `hero`.
 *
 * This strength modifier is historically shared with everyone in an army-group.
 *
 * @param {object} args
 * @param {array} args.effects list of effects
 *
 * @return {number} a strength-modifier or 0
 */
export const strengthModifierHero = ({effects = []} = {}) => {
  return sumEffectsByName(effects, 'hero')
}

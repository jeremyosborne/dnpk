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
 * Calculate the health modifier from `effect`s possessed that have `constitution`.
 *
 * This is assumed to be applied directly to the army posessing the effects.
 *
 * @param {object} args
 * @param {array} args.effects list of effects
 *
 * @return {number} the health modifier or 0
 */
export const healthModifierConstitution = ({effects = []} = {}) => {
  let health = 0
  if (effects && effects.length) {
    effects = _.filter(effects, (effect) => effect.name === 'constitution')
    health += sumEffects(effects)
  }
  return health
}

/**
 * Calculate the health modifier from `effect`s possessed that have `constitution-aura`.
 *
 * This is assumed to be applied as an army-group modifier and granted to everyone
 * in the army group.
 *
 * @param {object} args
 * @param {array} args.effects list of effects
 *
 * @return {number} the health modifier or 0
 */
export const healthModifierConstitutionAura = ({effects = {}} = {}) => {
  let health = 0
  if (effects && effects.length) {
    effects = _.filter(effects, (effect) => effect.name === 'constitution-aura')
    health += sumEffects(effects)
  }
  return health
}

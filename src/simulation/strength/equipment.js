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
 * Calculate the strength modifier from `equippable`s held by armies as
 * `equipment` that have a `brawn` effect.
 *
 * This strength modifier is historically applied to just the army and isn't
 * equivalent to strength-modifiers applied to a full army-group.
 *
 * @param {object} args
 * @param {array} args.equipment list of equippables
 *
 * @return {number} a strength-modifier or 0
 */
export const strengthModifierBrawn = ({equipment}) => {
  let strength = 0
  if (equipment && equipment.length) {
    const effects = _.reduce(equipment, (effects, eq) => {
      return effects.concat(
        _.filter(eq.effects, (effect) => effect.name === 'brawn')
      )
    }, [])

    strength += sumEffects(effects)
  }
  return strength
}

/**
 * Calculate the strength modifier from `equippable`s held by armies as
 * `equipment` that have a `command` effect.
 *
 * @param {object} args
 * @param {object} args.equipment list of equipabbles
 *
 * @return {number} the strength modifier or 0
 */
export const strengthModifierCommand = ({equipment}) => {
  let strength = 0
  if (equipment && equipment.length) {
    const effects = _.reduce(equipment, (effects, eq) => {
      return effects.concat(
        _.filter(eq.effects, (effect) => effect.name === 'command')
      )
    }, [])

    strength += sumEffects(effects)
  }
  return strength
}

import _ from 'lodash'

/**
 * Calculate the strength modifier from `equippable`s held by armies as
 * `equipment`.
 *
 * This strength modifier is historically applied to just the army and isn't
 * equivalent to strength-modifiers applied to a full army-group.
 *
 * @param {object} args
 * @param {array} args.equipment list of equippables
 *
 * @return {number} a strength-modifier
 */
export const strengthModifier = ({equipment}) => {
  let strength = 0
  if (equipment) {
    const strengthEffects = _.reduce(equipment, (effects, eq) => {
      return effects.concat(
        _.filter(eq.effects, (effect) => effect.name === 'strength')
      )
    }, [])
    strength += _.reduce(strengthEffects, (strengthModifier, strengthEffect) => {
      return strengthModifier + (strengthEffect.magnitude || 0)
    }, 0)
  }
  return strength
}

export default strengthModifier

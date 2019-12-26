import * as effects from './effects'
import _ from 'lodash'

/**
 * Calculate the strength modifier from `equippable`s held by armies as
 * `equipment` that have a `brawn` effect.
 *
 * @param {object} args
 * @param {array} args.equipment list of equippables
 *
 * @return {number} a strength-modifier or 0
 */
export const strengthModifierBrawn = ({equipment}) => {
  return _.reduce(equipment, (strengthModifier, equippable) => {
    // Equipment bonuses provided by effects on the equipment.
    return strengthModifier + effects.strengthModifierBrawn(equippable)
  }, 0)
}

/**
 * Calculate the strength modifier from `equippable`s held by armies as
 * `equipment` that have a `brawn-aura` effect.
 *
 * @param {object} args
 * @param {object} args.equipment list of equipabbles
 *
 * @return {number} the strength modifier or 0
 */
export const strengthModifierBrawnAura = ({equipment}) => {
  return _.reduce(equipment, (strengthModifier, equippable) => {
    // Equipment bonuses provided by effects on the equipment.
    return strengthModifier + effects.strengthModifierBrawnAura(equippable)
  }, 0)
}

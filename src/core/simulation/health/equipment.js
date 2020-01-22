import * as effects from './effects'
import _ from 'lodash'

/**
 * Calculate the health modifier from `equippable`s held by armies as
 * `equipment` that have a `constitution` effect.
 *
 * @param {object} args
 * @param {array} args.equipment list of equippables
 *
 * @return {number} the health modifier or 0
 */
export const healthModifierConstitution = ({equipment = []} = {}) => {
  return _.reduce(equipment, (healthModifier, equippable) => {
    // Equipment bonuses provided by effects on the equipment.
    return healthModifier + effects.healthModifierConstitution(equippable)
  }, 0)
}

/**
 * Calculate the health modifier from `equippable`s held by armies as
 * `equipment` that have a `constitution-aura` effect.
 *
 * @param {object} args
 * @param {object} args.equipment list of equipabbles
 *
 * @return {number} the health modifier or 0
 */
export const healthModifierConstitutionAura = ({equipment = []} = {}) => {
  return _.reduce(equipment, (healthModifier, equippable) => {
    // Equipment bonuses provided by effects on the equipment.
    return healthModifier + effects.healthModifierConstitutionAura(equippable)
  }, 0)
}

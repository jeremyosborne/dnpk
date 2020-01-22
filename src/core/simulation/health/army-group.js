import * as equipment from './equipment'
import * as effects from './effects'
import _ from 'lodash'

/**
 * Calculate the health modifier from equipped constitution-aura items.
 *
 * @param {object} args
 * @param {object|object[]} [args.armyGroup=[]] either a formal `army-group` that implements
 * `.armies` or a simple array of `army` types.
 *
 * @return {number} the health modifier or 0
 */
export const healthModifierEquippableConstitutionAura = ({armyGroup = []} = {}) => {
  const armies = Array.isArray(armyGroup) ? armyGroup : armyGroup.armies
  return _.reduce(armies, (modifier, army) => {
    return modifier + equipment.healthModifierConstitutionAura(army)
  }, 0)
}

/**
 * Calculate the health modifier from equipped constitution-aura items.
 *
 * @param {object} args
 * @param {object|object[]} [args.armyGroup=[]] either a formal `army-group` that implements
 * `.armies` or a simple array of `army` types.
 *
 * @return {number} the health modifier or 0
 */
export const healthModifierEffectsConstitutionAura = ({armyGroup = []} = {}) => {
  const armies = Array.isArray(armyGroup) ? armyGroup : armyGroup.armies
  return _.reduce(armies, (modifier, army) => {
    return modifier + effects.healthModifierConstitutionAura(army)
  }, 0)
}

/**
 * Calculates the health modifier from an army group which gets applied to
 * the army during battle.
 *
 * @param {object} args
 * @param {object|object[]} [args.armyGroup=[]] either a formal `army-group` that implements
 * `.armies` or a simple array of `army` types.
 *
 * @return {number} the health modifier provided by this group or 0
 */
export const healthModifier = ({armyGroup = []} = {}) => {
  let modifier = 0
  modifier += healthModifierEquippableConstitutionAura({armyGroup})
  modifier += healthModifierEffectsConstitutionAura({armyGroup})
  return modifier
}

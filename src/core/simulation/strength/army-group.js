import * as army from './army'
import * as equipment from './equipment'
import * as effects from './effects'
import _ from 'lodash'

/**
 * Calculate the strength modifier from aerial units.
 *
 * Aerial is treated as a boolean, multiple effects in the army group do not stack.
 *
 * @param {object} args
 * @param {object|object[]} [args.armyGroup=[]] either a formal `army-group` that implements
 * `.armies` or a simple array of `army` types.
 *
 * @return {number} the strength modifier or 0
 */
export const strengthModifierAerial = ({armyGroup = []} = {}) => {
  const armies = Array.isArray(armyGroup) ? armyGroup : armyGroup.armies
  if (_.some(armies, (army) => _.some(army.effects, (effect) => effect.name === 'aerial'))) {
    return 1
  } else {
    return 0
  }
}

/**
 * Calculate the strength modifier from elite units.
 *
 * Elite is treated as a boolean, multiple effects in the army group do not stack.
 *
 * @param {object} args
 * @param {object|object[]} [args.armyGroup=[]] either a formal `army-group` that implements
 * `.armies` or a simple array of `army` types.
 *
 * @return {number} the strength modifier or 0
 */
export const strengthModifierElite = ({armyGroup = []} = {}) => {
  const armies = Array.isArray(armyGroup) ? armyGroup : armyGroup.armies
  if (_.some(armies, (army) => _.some(army.effects, (effect) => effect.name === 'elite'))) {
    return 1
  } else {
    return 0
  }
}

/**
 * Calculate the strength modifier from equipped brawn-aura items.
 *
 * @param {object} args
 * @param {object|object[]} [args.armyGroup=[]] either a formal `army-group` that implements
 * `.armies` or a simple array of `army` types.
 *
 * @return {number} the strength modifier or 0
 */
export const strengthModifierEquippableBrawnAura = ({armyGroup = []} = {}) => {
  const armies = Array.isArray(armyGroup) ? armyGroup : armyGroup.armies
  return _.reduce(armies, (strengthModifier, army) => {
    return strengthModifier + equipment.strengthModifierBrawnAura(army)
  }, 0)
}

/**
 * Calculate the strength modifier from equipped brawn-aura items.
 *
 * @param {object} args
 * @param {object|object[]} [args.armyGroup=[]] either a formal `army-group` that implements
 * `.armies` or a simple array of `army` types.
 *
 * @return {number} the strength modifier or 0
 */
export const strengthModifierEffectsBrawnAura = ({armyGroup = []} = {}) => {
  const armies = Array.isArray(armyGroup) ? armyGroup : armyGroup.armies
  return _.reduce(armies, (strengthModifier, army) => {
    return strengthModifier + effects.strengthModifierBrawnAura(army)
  }, 0)
}

/**
 * Calculate the strength modifier from all hero units in the army group.
 *
 * @param {object} args
 * @param {object|object[]} [args.armyGroup=[]] either a formal `army-group` that implements
 * `.armies` or a simple array of `army` types.
 *
 * @return {number} the strength modifier or 0
 */
export const strengthModifierHero = ({armyGroup = []} = {}) => {
  const armies = Array.isArray(armyGroup) ? armyGroup : armyGroup.armies
  return _.reduce(armies, (modifier, a) => modifier + army.strengthModifierHero({army: a}), 0)
}

/**
 * Calculates the strength modifier from an army group which gets applied to
 * the army during battle.
 *
 * @param {object} args
 * @param {object|object[]} [args.armyGroup=[]] either a formal `army-group` that implements
 * `.armies` or a simple array of `army` types.
 *
 * @return {number} the strength bonus provided by this group.
 */
export const strengthModifier = ({armyGroup = []} = {}) => {
  let modifier = 0
  modifier += strengthModifierAerial({armyGroup})
  modifier += strengthModifierElite({armyGroup})
  modifier += strengthModifierEquippableBrawnAura({armyGroup})
  modifier += strengthModifierEffectsBrawnAura({armyGroup})
  modifier += strengthModifierHero({armyGroup})
  return modifier
}

export default strengthModifier

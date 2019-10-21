import * as army from './army'
import * as equipment from './equipment'
import _ from 'lodash'

/**
 * Calculate the strength modifier from elite units.
 *
 * Elite is treated as a boolean, multiple effects in the army group do not stack.
 *
 * @param {object} args main arguments as dictionary
 * @param {object} args.armyGroup
 *
 * @return {number} the strength modifier or 0
 */
export const strengthModifierElite = ({armyGroup}) => {
  if (_.some(armyGroup, (army) => _.some(army.effects, (effect) => effect.name === 'elite'))) {
    return 1
  } else {
    return 0
  }
}

/**
 * Calculate the strength modifier from aerial units.
 *
 * Aerial is treated as a boolean, multiple effects in the army group do not stack.
 *
 * @param {object} args main arguments as dictionary
 * @param {object} args.armyGroup
 *
 * @return {number} the strength modifier or 0
 */
export const strengthModifierAerial = ({armyGroup}) => {
  if (_.some(armyGroup, (army) => _.some(army.effects, (effect) => effect.name === 'aerial'))) {
    return 1
  } else {
    return 0
  }
}

/**
 * Calculate the strength modifier from equipped command items.
 *
 * @param {object} args main arguments as dictionary
 * @param {object} args.armyGroup
 *
 * @return {number} the strength modifier or 0
 */
export const strengthModifierEquippableCommand = ({armyGroup}) => {
  return _.reduce(armyGroup, (strengthModifier, army) => {
    return strengthModifier + equipment.strengthModifierCommand(army)
  }, 0)
}

/**
 * Calculate the strength modifier from all hero units in the army group.
 *
 * @param {object} args main arguments as dictionary
 * @param {object} args.armyGroup
 *
 * @return {number} the strength modifier or 0
 */
export const strengthModifierHero = ({armyGroup}) => {
  return _.reduce(armyGroup, (modifier, a) => modifier + army.strengthModifierHero({army: a}), 0)
}

/**
 * Calculates the strength modifier from an army group which gets applied to
 * the army during battle.
 *
 * @param {object} args as dictionary
 * @param {object[]} args.armyGroup array of army instances.
 *
 * @param {object} [config] configuration as dictionary
 * @param {function[]} [config.modifierFns] which modifier functions will be
 * used to calculate the terrain strength modifier.
 *
 * @return {number} the strength bonus provided by this group.
 */
export const strengthModifier = (
  {armyGroup},
  {
    modifierFns = [
      strengthModifierElite,
      strengthModifierAerial,
      strengthModifierEquippableCommand,
      strengthModifierHero,
    ],
  } = {}
) => {
  return _.reduce(modifierFns, (modifier, fn) => {
    return modifier + fn({armyGroup})
  }, 0)
}

export default strengthModifier

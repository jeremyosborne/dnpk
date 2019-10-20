import * as army from './army'
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
  // Aggregate all equipment.
  const equipment = _.reduce(armyGroup, (equipment, army) => {
    return equipment.concat(army.equipment || [])
  }, [])
  const commandEffects = _.reduce(equipment, (effects, eq) => {
    return effects.concat(
      _.filter(eq.effects, (effect) => effect.name === 'command')
    )
  }, [])
  return _.reduce(commandEffects, (commandBonus, commandEffect) => {
    return commandBonus + (commandEffect.magnitude || 0)
  }, 0)
}

/**
 * Calculate the strength modifier from all hero units in the army group.
 *
 * This method is somewhat awkard since it needs the effective strength of the
 * hero (includes battle items) to calculate correctly, even though it is an
 * aura style of effect only applicable (via classic rules) to an army group
 * bonus.
 *
 * @param {object} args main arguments as dictionary
 * @param {object} args.armyGroup
 *
 * @return {number} the strength modifier or 0
 */
export const strengthModifierHero = ({armyGroup}) => {
  const heroes = _.filter(armyGroup, (army) => _.some(army.effects, (effect) => effect.name === 'hero'))

  return _.reduce(heroes, (heroBonus, hero) => {
    // Needs to include battle items, which are applied to individual strength
    // and can effect total bonus to army group.
    const heroStrength = army.strength({army: hero})
    if (heroStrength >= 4 && heroStrength <= 6) {
      return heroBonus + 1
    } else if (heroStrength >= 7 && heroStrength <= 8) {
      return heroBonus + 2
    } else if (heroStrength >= 9) {
      return heroBonus + 3
    } else {
      return heroBonus
    }
  }, 0)
}

/**
 * Calculates the strength modifier from an army group which gets applied to
 * the army during battle.
 *
 * @param {object} args as dictionary
 * @param {object[]} args.armyGroup array of army instances.
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

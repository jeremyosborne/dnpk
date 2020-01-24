import gameObjectsCommonArmies from '../armies'
import _ from 'lodash'

// Takes an array of effects and an array of names and returns a summation of
// their magnitude values.
const modifierEffectSum = (effects, names) => _.reduce(effects, (effectModifier, effect) => {
  return effectModifier + (effect.name in names ? effect.magnitude : 0)
}, 0)

/**
 * Sum up a particular type of modifier given a group of armies.
 *
 * Assumptions made:
 *
 * - We are interested in all of the effects in the group that match by name.
 * - We look in `equipment -> effects` and `effects` of each object passed in.
 * - Our main argument, `objects`, should be an array of all items that contribute.
 * - Optionally an `armyGroup` can be added as a convenience, which will be
 *   added to the entire set of objects and contribute to the total modifier.
 *
 * @param {object} args
 * @param {string[]} args.effectNames the names of the effects to look for.
 * @param {object[]} [args.objects=[]] a list of objects that provide
 * effects that can contribute to the overall modifier value.
 * @param {object|object[]} [args.armyGroup=[]] if included, provides a convenience
 * to coerce the commonly used armyGroup into the total set of objects that will
 * be looked through.
 *
 * @return {number} the modifier provided by this group or 0
 */
export const sum = ({
  armyGroup = [],
  objects = [],
  effectNames = [],
} = {}) => {
  // concat armies into objects
  objects = objects.concat(gameObjectsCommonArmies.get(armyGroup))
  // Bag of effect names
  const names = _.reduce(effectNames, (names, name) => {
    names[name] = true
    return names
  }, {})

  return _.reduce(objects, (armyModifier, army) => {
    // Effects on the army.
    armyModifier += modifierEffectSum(army.effects, names)
    // Effects on the army equipment.
    armyModifier += _.reduce(army.equipment, (equipmentModifier, equippable) => {
      return equipmentModifier + modifierEffectSum(equippable.effects, names)
    }, 0)
    return armyModifier
  }, 0)
}

export default sum

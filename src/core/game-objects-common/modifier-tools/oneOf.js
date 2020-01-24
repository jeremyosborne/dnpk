import gameObjectsCommonArmies from '../armies'
import _ from 'lodash'

/**
 * Check for the presence of a particular effect, and if it exists, return
 * a preset value.
 *
 * Assumptions made:
 *
 * - We are interested in all of the effects in the group that match by name.
 * - We look in `equipment -> effects` and `effects` of each object passed in.
 * - Our main argument, `objects`, should be an array of all items that contribute.
 * - Optionally an `armyGroup` can be added as a convenience, which will be
 *   added to the entire set of objects and contribute to the total modifier.
 * - We quit early if we find any matching effect. The magnitude of the effect
 *   is not considered.
 *
 * @param {object} args
 * @param {string[]} args.effectNames the names of the effects to look for.
 * @param {object[]} [args.objects=[]] a list of objects that provide
 * effects that can contribute to the overall modifier value.
 * @param {object|object[]} [args.armyGroup=[]] if included, provides a convenience
 * to coerce the commonly used armyGroup into the total set of objects that will
 * be looked through.
 * @param {number} [args.value=1] the value to return if the presence of a tested
 * effect is found.
 *
 * @return {number} the value if items tested ar found, or 0
 */
export const oneOf = ({
  armyGroup = [],
  objects = [],
  effectNames = [],
  value = 1,
} = {}) => {
  // concat armies into objects
  objects = objects.concat(gameObjectsCommonArmies.get(armyGroup))
  // Bag of effect names
  const names = _.reduce(effectNames, (names, name) => {
    names[name] = true
    return names
  }, {})

  if (_.some(objects, (object) => {
    return _.some(object.effects, (effect) => effect.name in names) ||
      _.some(object.equipment, (equipment) => _.some(equipment.effects, effect => effect.name in names))
  })) {
    return value
  } else {
    return 0
  }
}

export default oneOf

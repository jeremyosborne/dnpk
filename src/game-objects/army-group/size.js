import _ from 'lodash'

/**
 * Return the size of the army-group.
 *
 * @param {object|object[]} armyGroup the object representing an army-group.
 *
 * @return {number} the determined size of object representing the army group,
 * 0 if no armies detected.
 */
export const size = (armyGroup) => {
  if (_.isArray(armyGroup)) {
    return armyGroup.length
  } else {
    return _.get(armyGroup, 'armies.length') || 0
  }
}

export default size

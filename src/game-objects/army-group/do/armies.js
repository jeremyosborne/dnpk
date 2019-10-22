import _ from 'lodash'

const _isStruct = (armyGroup) => {
  return !_.isArray(armyGroup)
}

const _armies = (armyGroup) => {
  return _isStruct(armyGroup) ? armyGroup.armies : armyGroup
}

/**
 * Does an army-group contain an army.
 *
 * @param {object} args
 * @param {object|object[]} args.armyGroup requires something that implements `armies`
 * or a simple array of armies.
 * @param {object} args.army army to test, must implement .id.
 *
 * @return {Boolean}
 */
export const has = ({armyGroup, army}) => {
  const armies = _armies(armyGroup)
  return !!_.find(armies, (a) => a.id === army.id)
}

/**
 * Add an army to an army-group if it is not already referenced.
 *
 * This will mutate the army-group object.
 *
 * @param {object} args
 * @param {object|object[]} args.armyGroup requires something that implements `armies`
 * or a simple array of armies.
 * @param {object} args.army added to the army-group. Must implement `.id`.
 */
export const add = ({armyGroup, army}) => {
  if (has({armyGroup, army})) {
    return
  }

  const armies = _armies(armyGroup)
  armies.push(army)
  if (_isStruct(armyGroup)) {
    armyGroup.armies = armies
  }
}

/**
 * Remove an army from an army-group if it exists in the army-group.
 *
 * This will mutate the army-group object.
 *
 * @param {object} args
 * @param {object|object[]} args.armyGroup requires something that implements `armies`
 * or a simple array of armies.
 * @param {object} args.army removed from the army-group. Must implement `.id`.
 *
 * @return {object} the army removed from the group, or null if the army
 * was not in the group.
 */
export const remove = ({armyGroup, army}) => {
  if (!has({armyGroup, army})) {
    return
  }

  const armies = _armies(armyGroup)
  // It's illegal to reference the same army twice in an array, so we assume
  // there can be only 1 in the list of armies at a time.
  const removed = _.remove(armies, (a) => a.id === army.id)[0]
  if (_isStruct(armyGroup)) {
    armyGroup.armies = armies
  }

  return removed
}

import _ from 'lodash'

//
// armies code
//
const _isStruct = (o) => {
  return !_.isArray(o)
}

const _armies = (o) => {
  return _isStruct(o) ? o.armies : o
}

/**
 * Does an army-group contain an army.
 *
 * @param {object|object[]} o requires something that implements `armies`
 * or a simple array of armies.
 * @param {object} army to test for, must implement `.id`.
 *
 * @return {Boolean}
 */
export const has = (o, army) => {
  const armies = _armies(o)
  return !!_.find(armies, (a) => a.id === army.id)
}

/**
 * Add an army to the set of `armies` if it is not already contained.
 *
 * This will mutate the object.
 *
 * @param {object|object[]} o requires something that implements `armies`
 * or a simple array of armies.
 * @param {object} army added to the army-group. Must implement `.id`.
 */
export const add = (o, army) => {
  if (has(o, army)) {
    return
  }

  const armies = _armies(o)
  armies.push(army)
  if (_isStruct(o)) {
    o.armies = armies
  }
}

/**
 * Remove an army to the set of `armies` if it is contained.
 *
 * This will mutate the object.
 *
 * @param {object|object[]} o requires something that implements `armies`
 * or a simple array of armies.
 * @param {object} army removed from the army-group. Must implement `.id`.
 *
 * @return {object} the army removed from the group, or null if the army
 * was not in the group.
 */
export const remove = (o, army) => {
  if (!has(o, army)) {
    return
  }

  const armies = _armies(o)
  // It's illegal to reference the same army twice in an array, so we assume
  // there can be only 1 in the list of armies at a time.
  const removed = _.remove(armies, (a) => a.id === army.id)[0]
  if (_isStruct(o)) {
    o.armies = armies
  }

  return removed
}

/**
 * Return the size of the `armies`.
 *
 * @param {object|object[]} o the object implementing `armies`.
 *
 * @return {number} the determined number of armies associated with this object,
 * 0 if no armies detected.
 */
export const size = (o) => {
  if (_.isArray(o)) {
    return o.length
  } else {
    return _.get(o, 'armies.length') || 0
  }
}

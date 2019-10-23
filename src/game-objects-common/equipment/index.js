import _ from 'lodash'

const _isStruct = (o) => {
  return !_.isArray(o)
}

const _equipment = (o) => {
  return _isStruct(o) ? o.equipment : o
}

/**
 * Does an object equip an item?
 *
 * @param {object|object[]} o requires something that implements `equipment`
 * or a simple array of equippables.
 * @param {object} equippable equipment to test for, must implement `.id`.
 *
 * @return {Boolean}
 */
export const has = (o, equippable) => {
  const equipment = _equipment(o)
  return !!_.find(equipment, (e) => e.id === equippable.id)
}

/**
 * Equip an item if not already equipped.
 *
 * This will mutate the object.
 *
 * @param {object|object[]} o requires something that implements `equipment`
 * or a simple array of equippables.
 * @param {object} equippable equipment to equip, must implement `.id`.
 */
export const add = (o, equippable) => {
  if (has(o, equippable)) {
    return
  }

  const equipment = _equipment(o)
  equipment.push(equippable)
  if (_isStruct(o)) {
    o.equipment = equipment
  }
}

/**
 * Remove an item if equipped.
 *
 * This will mutate the object.
 *
 * @param {object|object[]} o requires something that implements `equipment`
 * or a simple array of equippables.
 * @param {object} equippable to unequip, must implement `.id`.
 *
 * @return {object} the equippable unequipped, or null if the army
 * was not in the group.
 */
export const remove = (o, equippable) => {
  if (!has(o, equippable)) {
    return
  }

  const equipment = _equipment(o)
  // It's illegal to reference the same army twice in an array, so we assume
  // there can be only 1 in the list of armies at a time.
  const removed = _.remove(equipment, (e) => e.id === equippable.id)[0]
  if (_isStruct(o)) {
    o.equipment = equipment
  }

  return removed
}

/**
 * Return number of items equipped.
 *
 * @param {object|object[]} o the object implementing `equipment`.
 *
 * @return {number} number of items determined to be equipped, or 0.
 */
export const size = (o) => {
  if (_.isArray(o)) {
    return o.length
  } else {
    return _.get(o, 'equipment.length') || 0
  }
}

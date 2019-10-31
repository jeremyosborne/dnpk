import * as gameObjects from 'game-objects'
import _ from 'lodash'

const _isStruct = (o) => {
  return !_.isArray(o)
}

const _effects = (o) => {
  return _isStruct(o) ? o.effects : o
}

/**
 * Does an object have an effect?
 *
 * @param {object|object[]} o requires something that implements `effects`
 * or a simple array of effects.
 * @param {object} effect to test for, must implement `.id`.
 *
 * @return {Boolean}
 */
export const has = (o, effect) => {
  const effects = _effects(o)
  return !!_.find(effects, (e) => e.id === effect.id)
}

/**
 * Does the object have a particular `name` of effect?
 *
 * Used for a `some/any` style of test, like, "Is this object a hero?"
 *
 * @param {object|object[]} o requires something that implements `effects`
 * or a simple array of effects.
 * @param {string} name of the effect to look for.
 *
 * @return {Boolean}
 */
export const hasName = (o, name) => {
  const effects = _effects(o)
  return !!_.find(effects, (e) => e.name === name)
}

/**
 * Add an effect if not already added.
 *
 * This will mutate the object.
 *
 * @param {object|object[]} o requires something that implements `effects`
 * or a simple array of effects.
 * @param {object} effect to add, must implement `.id`.
 */
export const add = (o, effect) => {
  if (has(o, effect)) {
    return
  }

  const effects = _effects(o)
  effects.push(effect)
  if (_isStruct(o)) {
    o.effects = effects
  }
}

/**
 * Remove an effect if effected.
 *
 * This will mutate the object.
 *
 * @param {object|object[]} o requires something that implements `effects`
 * or a simple array of effects.
 * @param {object} effect to remove, must implement `.id`.
 *
 * @return {object} the effect removed, or null if the effect wasn't effecting
 * the object.
 */
export const remove = (o, effect) => {
  if (!has(o, effect)) {
    return
  }

  const effects = _effects(o)
  // It's illegal to reference the same army twice in an array, so we assume
  // there can be only 1 in the list of armies at a time.
  const removed = _.remove(effects, (e) => e.id === effect.id)[0]
  if (_isStruct(o)) {
    o.effect = effect
  }

  return removed
}

/**
 * Return number of effects effecting the effected.
 *
 * @param {object|object[]} o requires something that implements `effects`
 * or a simple array of effects.
 *
 * @return {number} number of effects, or 0.
 */
export const size = (o) => {
  if (_.isArray(o)) {
    return o.length
  } else {
    return _.get(o, 'effects.length') || 0
  }
}

//
// See `docs/blessings-and-shrines.md`.
//

/**
 * Blessings are effects with meta data and constraints unique to the `blessing`
 * sub-type.
 *
 * @type {Object}
 */
export const blessings = {}

/**
 * Has a particular object been granted a blessing from a particular diety?
 *
 * @param {object|object[]} o requires something that implements `effects`
 * or a simple array of effects.
 * @param {string} deity official name of the diety providing this blessing.
 *
 * @return {Boolean}
 */
blessings.has = (o, deity) => {
  return _.some(_effects(o), (effect) => _.get(effect, `metadata.name`) === deity)
}

/**
 * Add a blessing to a particular object if that blessing has not already been
 * granted.
 *
 * @param {object|object[]} o requires something that implements `effects`
 * or a simple array of effects.
 * @param {string} deity official name of the diety providing this blessing.
 *
 * @param {object} [config]
 * @param {String} [config.name='brawn'] the type of effect that makes up
 * this blessing.
 * @param {Number} [config.magnitude=1] the strength of the blessing.
 */
blessings.add = (o, deity, {
  name = 'brawn',
  magnitude = 1,
} = {}) => {
  const effect = gameObjects.effect.create({name})
  effect.magnitude = magnitude
  // Additional shrine meta-info.
  _.set(effect, 'metadata.name', deity)
  add(o, effect)
}

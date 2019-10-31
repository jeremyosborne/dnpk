import _ from 'lodash'

/**
 * Create a set of functions configured work with an object-list, like
 * `equipment` or `effects`.
 *
 * Sets of objects, like `effects` or `equipment`, have developed some nuanced
 * assumptions, and I got tired of repeating and tweaking the subtle differences
 * in lodash expressions.
 *
 * @param {object} args
 * @param {string} args.attrPath the `lodash.get` friendly path to the assumed
 * implementation of the attribute set on the object. Usually flat, like `equipment`
 * or `effects`.
 *
 * @return {object} basic set functions designed to work with a particular
 * `object-list` implementation.
 */
export const create = ({
  attrPath,
}) => {
  /**
   * There are times when the set itself might be passed around and yet we
   * wish to perform operations directly on the set.
   *
   * This occurs less and less as the code matures.
   *
   * @param {object|object[]} o object to test
   * @return {Boolean} true if this is not an array, false if it is.
   */
  const _isStruct = (o) => {
    return !_.isArray(o)
  }

  /**
   * Retrieve the attribute set from from the object, and assume that someone
   * handing us an array is a declaration that the caller has already done
   * the work of finding the set for us.
   *
   * @param {object|object[]} o object to test
   * @return {object[]} the attribute set we should work with.
   */
  const _attrSet = (o) => {
    return _isStruct(o) ? _.get(o, attrPath) : o
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
  const add = (o, effect) => {
    if (has(o, effect)) {
      return
    }

    const effects = _attrSet(o)
    effects.push(effect)
    if (_isStruct(o)) {
      o.effects = effects
    }
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
  const has = (o, effect) => {
    const effects = _attrSet(o)
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
  const hasName = (o, name) => {
    const effects = _attrSet(o)
    return !!_.find(effects, (e) => e.name === name)
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
  const remove = (o, effect) => {
    if (!has(o, effect)) {
      return
    }

    const effects = _attrSet(o)
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
  const size = (o) => {
    if (_.isArray(o)) {
      return o.length
    } else {
      return _.get(o, `${attrPath}.length`) || 0
    }
  }

  return {
    // Be nice to devs extending the API...
    _isStruct,
    _attrSet,

    // ...and assume this is the generally used public API.
    add,
    has,
    hasName,
    remove,
    size,
  }
}

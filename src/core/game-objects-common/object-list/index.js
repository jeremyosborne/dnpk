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
   *
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
   *
   * @return {object[]} the attribute set we should work with.
   */
  const _objectList = (o) => {
    return _isStruct(o) ? _.get(o, attrPath) : o
  }

  /**
   * Add an effect if not already added.
   *
   * This will mutate the object.
   *
   * @param {object|object[]} o requires something that implements the attrSet
   * or a simple array.
   * @param {object} effect to add, must implement `.id`.
   */
  const add = (o, thing) => {
    if (has(o, thing)) {
      return
    }

    const things = _objectList(o)
    things.push(thing)
    if (_isStruct(o)) {
      o[attrPath] = things
    }
  }

  /**
   * Get the underlying array, when you want to work directly with the object.
   *
   * @param {object|object[]} o requires something that implements the attrSet
   * or a simple array.
   * @param {number} [index] if included, return the element at index
   *
   * @return {object[]} the attribute set we should work with.
   */
  const get = (o, index) => {
    const objectList = _objectList(o)
    return _.isNumber(index) ? objectList[index] : objectList
  }

  /**
   * Does an object have an effect?
   *
   * @param {object|object[]} o requires something that implements the attrSet
   * or a simple array.
   * @param {object} thing to test for, must implement `.id`.
   *
   * @return {Boolean}
   */
  const has = (o, thing) => {
    const things = _objectList(o)
    return !!_.find(things, (t) => t.id === thing.id)
  }

  /**
   * Does the object have a particular `name` of effect?
   *
   * Used for a `some/any` style of test, like, "Is this object a hero?"
   *
   * @param {object|object[]} o requires something that implements the attrSet
   * or a simple array.
   * @param {string} name of the effect to look for.
   *
   * @return {Boolean}
   */
  const hasName = (o, name) => {
    const things = _objectList(o)
    return !!_.find(things, (t) => t.name === name)
  }

  /**
   * Remove an effect if effected.
   *
   * This will mutate the object.
   *
   * @param {object|object[]} o requires something that implements the attrSet
   * or a simple array.
   * @param {object} thing to remove, must implement `.id`.
   *
   * @return {object} the thing removed, or null if the thing wasn't in
   * the object set.
   */
  const remove = (o, thing) => {
    if (!has(o, thing)) {
      return
    }

    const things = _objectList(o)
    // It's illegal to reference the same army twice in an array, so we assume
    // there can be only 1 in the list of armies at a time.
    const removed = _.remove(things, (t) => t.id === thing.id)[0]
    if (_isStruct(o)) {
      o[attrPath] = things
    }

    return removed
  }

  /**
   * Return number of effects effecting the effected.
   *
   * @param {object|object[]} o requires something that implements the attrSet
   * or a simple array.
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
    _objectList,

    // ...and assume this is the generally used public API.
    add,
    get,
    has,
    hasName,
    remove,
    size,
  }
}

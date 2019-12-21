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
   * @return {Boolean} true if this is an object, false if it is a native array.
   */
  const _isStruct = (o) => {
    return !_.isArray(o)
  }

  /**
   * Retrieve the object-list that we should work with.
   *
   * Native array friendly.
   *
   * @param {object|object[]} o object to test
   *
   * @return {object[]} the object-list we should work with.
   */
  const _objectList = (o) => {
    return _isStruct(o) ? _.get(o, attrPath) : o
  }

  /**
   * Add an object to the object-list if not already added.
   *
   * This will mutate the object.
   *
   * @param {object|object[]} o requires something that implements the attrPath
   * or a native array.
   * @param {object} thing to add, must implement `.id`.
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
   * Look for a particular element by id and return it if it exists.
   *
   * @param {object|object[]} o requires something that implements the object
   * list at attrPath, or a native array.
   * @param {object|string} thing to test for. If object, must implement `id`.
   * If string, assumed to be the `id` to search for.
   *
   * @return {object} if found, returns the object.
   */
  const find = (o, thing) => {
    const things = _objectList(o)
    const id = _.isString(thing) ? thing : thing.id
    return _.find(things, (t) => t.id === id)
  }

  /**
   * Get the underlying array, when you want to work directly with the objec-list.
   *
   * @param {object|object[]} o requires something that implements the object-list
   * at attrPath, or a native array.
   * @param {number} [index] if included, return the element at index.
   *
   * @return {object[]} the object-list we should work with.
   */
  const get = (o, index) => {
    const objectList = _objectList(o)
    return _.isNumber(index) ? objectList[index] : objectList
  }

  /**
   * Does an object-list contain a particular object?
   *
   * @param {object|object[]} o requires something that implements the attrSet
   * or a simple array.
   * @param {object|string} thing to test for. If object, must implement `id`.
   * If string, assumed to be the `id` to test for.
   *
   * @return {Boolean}
   */
  const has = (o, thing) => {
    return !!find(o, thing)
  }

  /**
   * Does the object-list have a particularly `name`d object?
   *
   * Used for a `some/any` style of test, like, "Is this object a hero?"
   *
   * @param {object|object[]} o requires something that implements the object-list
   * or a simple array.
   * @param {string} name of the object to look for within the object-list.
   *
   * @return {Boolean}
   */
  const hasName = (o, name) => {
    const things = _objectList(o)
    return !!_.find(things, (t) => t.name === name)
  }

  /**
   * Remove an object from the object-list if contained.
   *
   * This will mutate the object-list.
   *
   * @param {object|object[]} o requires something that implements the object-list
   * or a native array.
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
    // It's against coding norms to reference the same object more than once within the
    // same object list, so we assume there can be only 1 in the list of armies at a time.
    const removed = _.remove(things, (t) => t.id === thing.id)[0]
    if (_isStruct(o)) {
      o[attrPath] = things
    }

    // Return the item removed as the input might be a partial object used
    // to identify the original, and the caller might want the original
    // reference of the object to remove.
    return removed
  }

  /**
   * Return number of objects within the object-list.
   *
   * @param {object|object[]} o requires something that implements the object-list
   * or a native array.
   *
   * @return {number} number of items in the object-list, or 0 for any other type of
   * object.
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
    find,
    get,
    has,
    hasName,
    remove,
    size,
  }
}

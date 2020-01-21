/**
 * Create a counter.
 *
 * @param {Object} [cache={}] optionally load with a pre-existing cache. The
 * cache is a simple associative array, where keys are assumed strings and
 * values are always assumed numbers.
 *
 * @return {Function} a function-object used for counting things.
 */
export const create = (cache = {}) => {
  /**
   * Count is a function object, where incrementing existing counts is main
   * method exposed.
   *
   * @param {String|Array} items if string, a singular key to modify. If an array,
   * elements are presumed to be a set of keys that are intended to be counted.
   * @param {Number} [value=1] if not included, a value of 1 is added to each
   * key. Use a negative number to decrement values.
   */
  const counter = (items, value = 1) => {
    if (Array.isArray(items)) {
      const size = items.length
      for (let i = 0; i < size; i++) {
        const key = items[i]
        const current = cache[key]
        cache[key] = isNaN(current) ? value : current + value
      }
    } else {
      // items assumed to be a singular value
      const current = cache[items]
      cache[items] = isNaN(current) ? value : current + value
    }
  }

  /**
   * In case it's clearer at times to write `add`.
   *
   * See `counter` for docs.
   *
   * @type {Function}
   */
  counter.add = counter

  /**
   * Drop the existing cache and replace with an empty cache.
   */
  counter.clear = () => {
    cache = {}
  }

  /**
   * Delete a particular key and associated value.
   *
   * @param {String} key to delete
   */
  counter.del = (key) => {
    delete cache[key]
  }

  /**
   * When you want to explicitly check whether a key has had a value added to
   * it (and hasn't yet been `del`eted).
   *
   * @param {String} key to check for existence.
   *
   * @return {Boolean} true if the key exists with a value, false if not.
   */
  counter.exists = (key) => {
    return typeof cache[key] !== 'undefined'
  }

  /**
   * Get the value associated with a particular key. As this will often show
   * up in comparisons and arithmetic, we have chocsen to return 0 for any
   * key. If you explicitly want to check for the existence of a key on a counter
   * use `exists`.
   *
   * @param {String} key for which to return the value.
   *
   * @return {Number} value for this key.
   */
  counter.get = (key) => {
    return cache[key] || 0
  }

  /**
   * When you need to set the specific value for a key and you don't want to
   * do arithmetic.
   *
   * @param {string} key to modify.
   * @param {Number} [value=0] value to set this key to. Setting the value to 0
   * is not the same as `del`eting the value, but is the default behavior.
   */
  counter.set = (key, value = 0) => {
    cache[key] = value
  }

  /**
   * Return a sorted list of current counts in the counter.
   *
   * @return {object[]} Array of {label, value} objects sorted in descending
   * order by value. If no counts are in the counter, an empty array will be
   * returned.
   */
  counter.sorted = () => {
    const counts = []
    for (const p in cache) {
      if (Object.prototype.hasOwnProperty.call(cache, p)) {
        counts.push({label: p, value: cache[p]})
      }
    }

    return counts.sort((a, b) => {
      // Descending order.
      return b.value - a.value
    })
  }

  /**
   * Total of all the values currently in the counter.
   *
   * @return {[type]} [description]
   */
  counter.sum = () => {
    let total = 0
    for (const p in cache) {
      if (Object.prototype.hasOwnProperty.call(cache, p)) {
        total += cache[p]
      }
    }
    return total
  }

  /**
   * Returns the cache, and used by JSON.stringify.
   *
   * @return {Object} the chache, which should always be JSON friendly.
   */
  counter.toJSON = () => {
    return cache
  }

  return counter
}

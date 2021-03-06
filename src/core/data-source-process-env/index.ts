/**
 * Whether or not this data source exists and can be accessed.
 */
export const exists = () => {
  // This is hard to test in babel-node since process.env always needs to be
  // an object and can't be null or undefined.
  return typeof process === "object" && typeof process.env === "object"
}

/**
 * Return the data source as an object (associative array), or null if
 * it doesn't exist.
 *
 * @return {object} or null if it does not exist.
 */
export const get = () => {
  try {
    return process.env
  } catch (err) {
    // This is hard to test for in babel-node as process.env is always required
    // to exist.
    return null
  }
}

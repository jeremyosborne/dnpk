/**
 * Whether or not this data source exists and can be accessed.
 *
 * @return {boolean} true if it exists, false if not.
 */
export const exists = () => {
  return typeof window !== 'undefined'
}

/**
 * Return the data source as an object (associative array), or null if
 * it doesn't exist.
 *
 * @return {object} or null if it does not exist.
 */
export const get = () => {
  try {
    return window
  } catch (err) {
    return null
  }
}

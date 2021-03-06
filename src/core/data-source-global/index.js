/**
 * Whether or not this data source exists and can be accessed.
 *
 * @return {boolean} true if it exists, false if not.
 */
export const exists = () => {
  // Global must always exist in JavaScript.
  return true
}

/**
 * Return the data source as an object (associative array).
 *
 * @return {object}
 */
export const get = () => {
  if (typeof window !== "undefined") {
    return window // eslint-disable-line no-undef
  } else {
    return global
  }
}

/**
 * Whether or not this data source exists and can be accessed.
 */
export const exists = () => {
  // Global must always exist in JavaScript.
  return true
}

/**
 * Return the data source as an object (associative array).
 */
export const get = (): typeof globalThis & {
  DNPK_RUNTIME_CONFIGURATION?: Record<string, string>
} => {
  if (typeof window !== "undefined") {
    return window // eslint-disable-line no-undef
  } else {
    return global
  }
}

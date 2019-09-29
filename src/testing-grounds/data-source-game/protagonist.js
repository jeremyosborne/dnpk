/**
 * Player object, if one has been created.
 * @type {object}
 */
let _cache = null

export const exists = () => {
  return !!_cache
}

export const get = () => {
  return _cache
}

export const set = (data) => {
  _cache = {
    ...data,
  }
}

// per ES spec, data structure should be JSON friendly.
export const toJSON = () => {
  return _cache
}

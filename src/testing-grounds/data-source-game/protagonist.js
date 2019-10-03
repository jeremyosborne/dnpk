import * as gameObjects from 'game-objects'

/**
 * Player object, if one has been created.
 * @type {object}
 */
let _cache = null

export const create = () => {
  _cache = gameObjects.player.create()
}

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

import debug from 'debug'
import * as _io from 'io'
import _ from 'lodash'
import * as gameObjects from 'game-objects'

const _logger = debug('dnpk/testing-grounds/data-source-game')

const DATA_KEY = 'testing-grounds/protagonist'

export class Protagonist {
  /**
   * Player object, if one has been created.
   */
  _cache: any | null = null

  clear = () => {
    this._cache = null
  }

  create = () => {
    this._cache = gameObjects.player.create()
  }

  exists = () => {
    return !!this._cache
  }

  get = () => {
    return this._cache
  }

  /**
   * Returns the army-group of the protagonist if it exists.
   *
   * Addresses a common need in the `meat-grinder`.
   *
   * @param {number} [index=0] can choose the particular index in the array
   * of armyGroups.
   *
   * @return {object} an `army-group`, if one exists.
   */
  getArmyGroup = (index = 0) => {
    return _.get(this._cache, `armyGroups[${index}]`)
  }

  /**
   * Read any existing game state from disk and into memory, or do nothing if
   * read fails (doesn't exist, bad encoding, etc.).
   *
   * @return {Promise}
   */
  read = async ({
    dataKey = DATA_KEY,
    io = _io,
    logger = _logger,
  } = {}) => {
    try {
      this.set(await io.read(DATA_KEY))
    } catch (err) {
      logger(`Could not read user data ${dataKey}, perhaps it's intentionally empty?`)
    }
  }

  remove = async ({
    dataKey = DATA_KEY,
    io = _io,
  } = {}) => {
    await io.remove(dataKey)
    this.clear()
  }

  set = (data: any) => {
    this._cache = {
      ...this._cache,
      ...data,
    }
  }

  save = async (data: any) => {
    this.set(data)
    await this.write()
  }

  toJSON = () => {
    return this._cache
  }

  /**
   * Save the game state to disk.
   *
   * @return {Promise}
   */
  write = async ({
    dataKey = DATA_KEY,
    io = _io,
  } = {}) => {
    await io.write(dataKey, this._cache)
  }
}

export const protagonist = new Protagonist()

import debug from 'debug'
import * as _io from 'io'

const _logger = debug('dnpk/testing-grounds/data-source-game')

const DATA_KEY = 'testing-grounds/settings'

const settingsData = () => ({
  /** If customized, what game rules are we using? */
  gameRulesName: '',
})

export class Settings {
  /**
   * Customizable settings. Always exists. Settings, if not defined, are considered false.
   *
   * @type {object}
   */
  _cache = settingsData()

  clear = () => {
    this._cache = settingsData()
  }

  create = () => {
    this._cache = settingsData()
  }

  exists = () => {
    return !!this._cache
  }

  get = () => {
    return this._cache
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
      logger(`Could not read settings data ${dataKey}, perhaps it's intentionally empty?`)
    }
  }

  remove = async ({
    dataKey = DATA_KEY,
    io = _io,
  } = {}) => {
    await io.remove(dataKey)
    this.clear()
  }

  set = (data) => {
    this._cache = {
      ...this._cache,
      ...data,
    }
  }

  save = async (data) => {
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

export const settings = new Settings()

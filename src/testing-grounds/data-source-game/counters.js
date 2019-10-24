import * as counter from 'counter'
import debug from 'debug'
import * as _io from 'io'

const _logger = debug('dnpk/testing-grounds/data-source-game')

export class TestingGroundsCounter {
  constructor (dataKey) {
    this.data_key = dataKey
  }

  /**
   * Cache of the counter.
   * @type {object}
   */
  _cache = {}

  /**
   * Passthrough to counter.
   */
  add = (...args) => {
    const c = counter.create(this._cache)
    c.add(...args)
    this._cache = c.toJSON()
  }

  clear = () => {
    this._cache = {}
  }

  create = () => {
    this._cache = {}
  }

  exists = () => {
    return !!this._cache
  }

  get = () => {
    return counter.create(this._cache)
  }

  /**
   * Read any existing game state from disk and into memory, or do nothing if
   * read fails (doesn't exist, bad encoding, etc.).
   *
   * @return {Promise}
   */
  read = async ({
    dataKey,
    io = _io,
    logger = _logger,
  } = {}) => {
    dataKey = dataKey || this.data_key
    try {
      this.set(await io.read(dataKey))
    } catch (err) {
      logger(`Could not read user data ${dataKey}, perhaps it's intentionally empty?`)
    }
  }

  remove = async ({
    dataKey,
    io = _io,
  } = {}) => {
    dataKey = dataKey || this.data_key
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

  /**
   * Passthrough to counter.
   */
  subtract = (...args) => {
    const c = counter.create(this._cache)
    c.subtract(...args)
    this._cache = c.toJSON()
  }

  /**
   * Passthrough to counter.
   */
  sorted = () => {
    const c = counter.create(this._cache)
    return c.sorted()
  }

  /**
   * Passthrough to counter.
   */
  sum = () => {
    const c = counter.create(this._cache)
    return c.sum()
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
    dataKey,
    io = _io,
  } = {}) => {
    dataKey = dataKey || this.data_key
    await io.write(dataKey, this._cache)
  }
}

export const killCounter = new TestingGroundsCounter('testing-grounds/kill-counter')
export const deadCounter = new TestingGroundsCounter('testing-grounds/dead-counter')

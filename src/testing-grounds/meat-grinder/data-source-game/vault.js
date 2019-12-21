import _ from 'lodash'
import debug from 'debug'
import * as _io from 'io'

const _logger = debug('dnpk/testing-grounds/data-source-game')

export class Vault {
  constructor (dataKey) {
    this.data_key = dataKey
  }

  /**
   * Equippables and items.
   * @type {array}
   */
  _cache = []

  clear = () => {
    this._cache = []
  }

  create = () => {
    this._cache = []
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

  // As we're an array, this is a replacement, and data better be an Array.
  set = (data, {
    logger = _logger,
  } = {}) => {
    if (_.isArray(data)) {
      this._cache = data
    } else {
      logger(`Attempting to set with non Array data: ${data}. Set not performed.`)
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
    dataKey,
    io = _io,
  } = {}) => {
    dataKey = dataKey || this.data_key
    await io.write(dataKey, this._cache)
  }

  /**
   * Does this vault contain an item?
   *
   * @param {object} equippable equipment to test for, must implement `.id`.
   *
   * @return {Boolean}
   */
  has = (equippable) => {
    return !!_.find(this._cache, (e) => e.id === equippable.id)
  }

  /**
   * Add an item to the vault if it is not already in the vault.
   *
   * @param {object} equippable equipment to equip, must implement `.id`.
   */
  add = (equippable) => {
    if (this.has(this._cache, equippable)) {
      return
    }

    this._cache.push(equippable)
  }

  /**
   * Remove an item from the vault if it is in the vault.
   *
   * @param {object} equippable to unequip, must implement `.id`.
   *
   * @return {object} the equippable item that was removed from the vault,
   * or null if the item wasn't in the vault to begin with.
   */
  remove = (equippable) => {
    if (!this.has(this._cache, equippable)) {
      return
    }

    const removed = _.remove(this._cache, (e) => e.id === equippable.id)[0]

    return removed
  }

  /**
   * Return number of items in the vault.
   *
   * @return {number} number of items determined to be equipped, or 0.
   */
  size = () => {
    return this._cache.length || 0
  }
}

export const vaultEquippables = new Vault('testing-grounds/equipment-vault')

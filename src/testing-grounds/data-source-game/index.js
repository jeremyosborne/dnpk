import debug from 'debug'
import * as io from 'io'

import * as protagonist from './protagonist'
export {protagonist}

const logger = debug('dnpk/testing-grounds/data-source-game')

export const remove = async () => {
  await io.remove('testing-grounds/protagonist')
}

/**
 * Save the game state to disk.
 *
 * @return {Promise}
 */
export const write = async () => {
  await io.write('testing-grounds/protagonist', protagonist)
}

/**
 * Read any existing game state from disk and into memory, or do nothing if
 * read fails (doesn't exist, bad encoding, etc.).
 *
 * @return {Promise}
 */
export const read = async () => {
  try {
    protagonist.set(await io.read('testing-grounds/protagonist'))
  } catch (err) {
    logger("Could not read user data `protagonist`, perhaps it's intentionally empty?")
  }
}

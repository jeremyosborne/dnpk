import debug from 'debug'
import dataSourceUserData from '../data-source-user-data'

import * as protagonist from './protagonist'
export {protagonist}

const logger = debug('dnpk/testing-grounds/data-source-game')

/**
 * Save the game state to disk.
 *
 * @return {Promise}
 */
export const write = async () => {
  // I'm sure there's a more elegant way to do this that I will figure out later.
  await dataSourceUserData.write('protagonist.json', protagonist)
}

/**
 * Read any existing game state from disk and into memory, or do nothing if
 * read fails (doesn't exist, bad encoding, etc.).
 *
 * @return {Promise}
 */
export const read = async () => {
  try {
    protagonist.set(await dataSourceUserData.read('protagonist.json'))
  } catch (err) {
    logger('could not read user data protagonist.json')
  }
}

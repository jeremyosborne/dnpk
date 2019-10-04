import protagonist from './protagonist'
export {protagonist}

/**
 * Remove all of the testing-ground state from disk.
 *
 * @return {Promise} [description]
 */
export const remove = async () => {
  await protagonist.remove()
}

/**
 * Save all of the testing-ground game state to disk.
 *
 * @return {Promise}
 */
export const write = async () => {
  await protagonist.write()
}

/**
 * Read any existing game state from disk and into memory, or do nothing if
 * read fails (doesn't exist, bad encoding, etc.).
 *
 * This will reset whatever was in memory to what is on disk, unless there is
 * nothing on disk.
 *
 * @return {Promise}
 */
export const read = async () => {
  await protagonist.read()
}

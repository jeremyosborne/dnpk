import {killCounter, deadCounter} from './counters' // eslint-disable-line import/first
export {killCounter, deadCounter}

import protagonist from './protagonist' // eslint-disable-line import/first
export {protagonist}

// Register module here to opt into the batch loading, remove, writing, etc.
const aggregate = [
  deadCounter,
  killCounter,
  protagonist,
]

/**
 * Remove all of the testing-ground state from disk.
 *
 * @return {Promise} [description]
 */
export const remove = async () => {
  const batch = Promise.all(aggregate.map((m) => m.remove()))
  await batch
}

/**
 * Save all of the testing-ground game state to disk.
 *
 * @return {Promise}
 */
export const write = async () => {
  const batch = Promise.all(aggregate.map((m) => m.write()))
  await batch
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
  const batch = Promise.all(aggregate.map((m) => m.read()))
  await batch
}

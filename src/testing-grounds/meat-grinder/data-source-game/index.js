import _ from "lodash"

import { counterKills, counterDead } from "./counters"
export { counterKills, counterDead }

import { protagonist } from "./protagonist"
export { protagonist }

import { settings } from "./settings"
export { settings }

import { vaultEquippables } from "./vaults"
export { vaultEquippables }

// Register module here to opt into the batch loading, remove, writing, etc.
export const dataSources = {
  counterDead,
  counterKills,
  protagonist,
  settings,
  vaultEquippables,
}

/**
 * Remove all of the testing-ground state from disk.
 *
 * @return {Promise} [description]
 */
export const remove = async () => {
  const batch = Promise.all(_.map(dataSources, (ds) => ds.remove()))
  await batch
}

/**
 * Save all of the testing-ground game state to disk.
 *
 * @return {Promise}
 */
export const write = async () => {
  const batch = Promise.all(_.map(dataSources, (ds) => ds.write()))
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
  const batch = Promise.all(_.map(dataSources, (ds) => ds.read()))
  await batch
}

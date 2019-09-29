import envPaths from 'env-paths'
import {promises as fs} from 'fs'
import makeDir from 'make-dir'
import path from 'path'

const APP_USER_DATA_NAMESPACE = require('../../../package.json').name

/**
 * Root of where we store user data on a user by user basis.
 *
 * @return {string}
 */
export const userDataPath = () => {
  // see: https://github.com/sindresorhus/env-paths#suffix
  return envPaths(require(APP_USER_DATA_NAMESPACE), {suffix: 'training-grounds'}).data
}

/**
 * Store some data specific to a user.
 *
 * @param {object} args
 * @param {string} args.dataPath relative filename to write out to. Existing data
 * will be overwritten.
 * @param {object} args.data to be serialized as JSON and written to disk.
 *
 * @return {Promise}
 */
export const write = async ({dataPath, data}, options = {}) => {
  const subfolder = path.dirname(dataPath)
  // If file is in base of app directory, we only need the user path.
  const p = path.join(userDataPath(), subfolder !== '.' ? subfolder : '')
  // No retry. just fail for now.
  await makeDir(p)
  return fs.write(p, JSON.stringify(data))
}

/**
 * Read some data specific to a user.
 *
 * @param {string} dataPath relative filename to read from.
 *
 * @return {Promise} resolves if file exists, rejects if file does not or there
 * is some other problem while reading the file.
 */
export const read = async (dataPath) => {
  const p = path.join(userDataPath(), dataPath)
  // No retry. just fail for now.
  return JSON.parse(await fs.readFile(p))
}

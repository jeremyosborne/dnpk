import del from 'del'
import envPaths from 'env-paths'
import {promises as fs} from 'fs'
import _makeDir from 'make-dir'
import path from 'path'

/**
 * Root path of data storage for file system, flat style storage.
 *
 * @return {string}
 */
export const _rootPathFileSystem = () => {
  // see: https://github.com/sindresorhus/env-paths#suffix
  return envPaths(require('../../../package.json').name).data
}

/**
 * Root path from which our other keys are built.
 *
 * @param {string} dataPath app specific key path to data.
 * @param {object} config
 * @param {function} config.rootPathFileSystem function that will be passed the
 * relative path and must return the full path.
 *
 * @return {string}
 */
export const _genPath = (dataPath, {
  rootPathFileSystem = _rootPathFileSystem,
} = {}) => {
  // Normalize should protect from walking up and out of our data storage directory.
  return path.join(rootPathFileSystem(), path.normalize(dataPath))
}

/**
 * Read data from a specific key.
 *
 * @param {string} dataPath app specific key path to data.
 * @param {object} config
 * @param {function} config.genPath used to determine rootPath for all of our
 * dataPath keys.
 * @param {function} config.readFile function used to read a file from disk when
 * in `file system` mode. Will be passed the path of the file to read, and should
 * return a promise that resolves with raw text that will be passed to JSON.parse.s
 *
 * @return {Promise<object, error>} resolves and returns data if data exists and
 * can be retrieved, rejects if data does not exist or there is some other
 * problem while reading the file.
 */
export const read = async (dataPath, {
  genPath = _genPath,
  readFile = fs.readFile,
} = {}) => {
  // Caller should expect exception and can have the raw error until we figure
  // out an error object that is good enough for our needs.
  return JSON.parse(await readFile(genPath(dataPath)))
}

/**
 * Remove data from a specific key.
 *
 * @param {string} dataPath app specific key path to data.
 * @param {object} config
 * @param {function} config.genPath used to determine rootPath for all of our
 * dataPath keys.
 * @param {function} config.delFile function used to remove a file from disk when
 * in `file system` mode. Will be passed the path of the file to delete, and
 * should return a promise that resolves on successful deletion.
 *
 * @return {Promise<null, error>} resolves if file is successfully deleted or
 * the file did not exist, rejects on other unexpected errors.
 */
export const remove = async (dataPath, {
  genPath = _genPath,
  removeFile = (...args) => del(...args, {force: true}),
} = {}) => {
  return removeFile(genPath(dataPath))
}

/**
 * Store some data specific to a user.
 *
 * @param {string} dataPath relative filename to write out to. Existing data
 * will be overwritten.
 * @param {object} data to be serialized as JSON and written to disk.
 * @param {object} config
 * @param {function} config.genPath used to determine rootPath for all of our
 * dataPath keys.
 * @param {function} config.makeDir necessary evil for file systems that I
 * am going to inject, but do nothing else about at the moment.
 * @param {function} config.writeFile function used to write a file to disk when
 * in `file system` mode. Will be passed the path of the file to write and plain
 * text to write, and should return a promise that resolves on successful write.
 *
 * @return {Promise}
 */
export const write = async (dataPath, data, {
  genPath = _genPath,
  // Making directories sucks in a `key:value` world. Hide this a bit better
  // when we move to an HTTP style of storing data... this should probably be
  // wrapped up in the writeFile injected function and if we need to pass
  // more info to the callbacks to ensure correctness, then we should do that.
  makeDir = _makeDir,
  writeFile = fs.writeFile,
} = {}) => {
  // Normalize should protect from walking up and out of our data storage directory.
  const fullPath = genPath(dataPath)
  // Is the relative key, for some reason, at the base of the data storage path?
  // Is this a good idea? Should we maybe require all files to be subfoldered?
  if (path.dirname(dataPath) !== '.') {
    // Relative file lives in a subfolder.
    await makeDir(path.dirname(fullPath))
  }
  return writeFile(fullPath, JSON.stringify(data))
}

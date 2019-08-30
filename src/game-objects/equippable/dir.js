import * as configGameObjects from 'config-game-objects'

/**
 * List of `name`s of loaded equippables.
 *
 * @return {string[]} List of unique names.
 */
export const dir = () => configGameObjects.dir('equippable')

export default dir

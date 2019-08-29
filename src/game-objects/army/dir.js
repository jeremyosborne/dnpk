import * as configGameObjects from 'config-game-objects'

/**
 * List of `name`s of loaded armies.
 *
 * @return {string[]} List of unique army names.
 */
export const dir = () => configGameObjects.dir('army')

export default dir

import * as dataSourceGameObjects from 'data-source-game-objects'

/**
 * List of `name`s of loaded armies.
 *
 * @return {string[]} List of unique army names.
 */
export const dir = () => dataSourceGameObjects.dir('army')

export default dir

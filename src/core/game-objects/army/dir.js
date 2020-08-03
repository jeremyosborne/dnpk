import * as dataSourceModdables from 'data-source-moddables'

/**
 * List of `name`s of loaded entities.
 *
 * @return {string[]} List of unique entity names.
 */
export const dir = () => dataSourceModdables.dir('army')

export default dir

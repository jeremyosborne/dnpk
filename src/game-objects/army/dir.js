import * as dataSourceModdables from 'data-source-moddables'

/**
 * List of `name`s of loaded armies.
 *
 * @return {string[]} List of unique army names.
 */
export const dir = () => dataSourceModdables.dir('army')

export default dir

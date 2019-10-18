import * as dataSourceModdables from 'data-source-moddables'

/**
 * List of all of the `names` of available rule sets.
 *
 * @return {string[]} List of unique names.
 */
export const dir = () => dataSourceModdables.dir('rules')

export default dir

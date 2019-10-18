import path from 'path'

/**
 * Root path for where our moddables live.
 * For an installable game, these files will get moved to the user directory.
 * For a server based game, these files will be loaded. Either way, we'll
 * eventually need to move to the `io` module, which will also mean the `io`
 * module will need to be made more flexible.
 * @return {string}
 */
export const moddablesKeyRoot = () => path.resolve(path.resolve(__dirname), '../../data-sources/moddables')

export default moddablesKeyRoot

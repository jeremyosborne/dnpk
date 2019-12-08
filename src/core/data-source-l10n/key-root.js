// @flow
import path from 'path'

/**
 * Root key path for l10n files.
 *
 * Data sources use `key: value` pairs, where our keys happen to be path-like.
 *
 * For an installable game, these files will get moved to the user directory.
 * For a server based game, these files will be loaded. Either way, we'll
 * eventually need to move to the `io` module, which will also mean the `io`
 * module will need to be made more flexible.
 */
export const keyRoot = (): string => path.resolve(path.resolve(__dirname), '../../../data-sources/l10n')

export default keyRoot

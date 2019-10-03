import {t} from 'l10n'

/**
 * Pass directly to console.log.
 *
 * @param {...object} args passed directly to console.log.
 */
export const out = (...args) => {
  console.log(...args)
}

/**
 * Pass to console.log through `l10n.t`.
 *
 * @param {...object} args passed to a single call to `l10n.t`.
 */
out.t = (...args) => {
  console.log(t(...args))
}

export default out

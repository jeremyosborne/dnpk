import {t} from 'l10n'
import out from './out'

/**
 * Generate a flag character.
 *
 * @param {string} args params as arguments.
 * @param {string} [args.color='#FFFFFF'] color of the flag to show.
 * @param {string} [args.label='\u2691'] symbol used to represent the flag
 *
 * @return {string} colorized unicode flag.
 */
export const string = ({label = '\u2691', color = '#FFFFFF'} = {}) => t('{{flag, colorize}}', {flag: {label, color}})

/**
 * Direct-to-out wrapper. See `string`.
 */
export const flag = (...args) => out(string(...args))

/**
 * Convenience. See `string`.
 */
flag.string = string

export default flag

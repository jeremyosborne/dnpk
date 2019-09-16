import chalk from 'chalk'
import out from './out'

/**
 * Generate a flag character.
 *
 * @param {string} args params as arguments.
 * @param {String} [args.color='#FFFFFF'] Color of the flag to show.
 *
 * @return {string} colorized unicode flag.
 */
export const string = ({color = '#FFFFFF'} = {}) => chalk.hex(color)('\u2691')

/**
 * Direct-to-out wrapper. See `string`.
 */
export const flag = (...args) => out(string(...args))

/**
 * Convenience. See `string`.
 */
flag.string = string

export default flag

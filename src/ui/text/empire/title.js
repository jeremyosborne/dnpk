import debug from 'debug'
import flag from '../flag'
import * as gameObjects from 'game-objects'
import out from '../out'

const logger = debug('dnpk/ui/text/empire')

/**
 * Display the empire name.
 *
 * Versatile function that attempts to do the right thing depending on input.
 *
 * @param {object} data something that implements either `empire` or `player`
 * structure.
 *
 * @return {string}
 */
export const string = ({empire}) => {
  const name = gameObjects.common.name(empire)
  if (!name) {
    logger('warning, called title() with incompatible data param of:', empire)
  }

  return `${name} ${flag.string(empire)}`
}

/**
 * Direct-to-out wrapper. See `string`.
 */
export const title = (...args) => out(string(...args))

/**
 * Convenience. See `string`.
 */
title.string = string

export default title

import chalk from 'chalk'
import debug from 'debug'
import _ from 'lodash'
import * as gameObjects from 'game-objects'
import out from '../out'

const logger = debug('dnpk/ui/text/empire')

/**
 * Display the empire name.
 *
 * Versatile function that attempts to do the right thing.
 *
 * @param {object} data something that implements either `empire` or `player`
 * structure.
 *
 * @return {string}
 */
export const string = (data) => {
  const empire = _.get(data, 'empire') || data
  const name = gameObjects.common.name(empire)
  const color = _.get(empire, 'color')
  if (!name) {
    logger('warning, called title() with incompatible data param of:', data)
  }
  return chalk.hex(color)(name)
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

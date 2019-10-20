import * as dataSourceConfig from 'data-source-config'
import debug from 'debug'

const logger = debug('game-rules')

let NAME_DEFAULT = dataSourceConfig.get('RULES_NAME_DEFAULT') || 'classic'

/**
 * Get or set the `name` of the rules currently being used in the game.
 *
 * Used by the `rules.get` method.
 *
 * @param {string} [name] if provided, sets the name of the rule set to this.
 *
 * @return {string} if called without arguments, returns the name of the
 * current rule set being used.
 */
export const nameDefault = (name) => {
  if (name) {
    // setter, as the rule `name` should always be set to something.
    logger(`changing rule set from '${NAME_DEFAULT}' to '${name}'.`)
    NAME_DEFAULT = name
  } else {
    // getter
    return NAME_DEFAULT
  }
}

export default nameDefault

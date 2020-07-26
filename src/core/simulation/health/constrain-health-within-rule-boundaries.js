import debug from 'debug'
import * as gameRules from 'game-rules'

const _logger = debug('dnpk/health/constrain-health-within-rule-boundaries')

// Sane defaults.
export const MAX_DEFAULT = 5
export const MIN_DEFAULT = 1

/**
 * Make sure a health value is within the allowed boundaries of the game rules,
 * or restricted to default.
 *
 * @param {number} health calculated elsewhere, passed here to restrict to allowed values.
 *
 * @return {number} the constrained value of the health.
 */
export const constrainHealthWithinRuleBoundaries = (health = 0, {
  logger = _logger,
  max = () => gameRules.get('armyHealthMax'),
  maxDefault = MAX_DEFAULT,
  min = () => gameRules.get('armyHealthMin'),
  minDefault = MIN_DEFAULT,
} = {}) => {
  let healthMax = max()
  if (typeof healthMax !== 'number') {
    healthMax = maxDefault
    logger('WARNING: non-number value for max, defaulting to:', healthMax)
  }

  let healthMin = min()
  if (typeof healthMin !== 'number') {
    healthMin = minDefault
    logger('WARNING: non-number value for min, defaulting to:', healthMin)
  }

  if (healthMin > healthMax) {
    throw new Error('the minimum limit should never be larger than the maximum limit, although they are allowed to be equal.')
  }

  return Math.max(healthMin, Math.min(health, healthMax))
}

export default constrainHealthWithinRuleBoundaries

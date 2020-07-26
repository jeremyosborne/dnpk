import debug from 'debug'
import * as gameRules from 'game-rules'

const _logger = debug('dnpk/strength/constrain-strength-within-rule-boundaries')

// Classic values.
export const MIN_DEFAULT = 0
export const MAX_DEFAULT = 9

/**
 * Make sure a strength value is within the allowed boundaries of the game rules,
 * or restricted to default.
 *
 * @param {number} strength calculated elsewhere, passed here to restrict to allowed values.
 *
 * @return {number} the constrained value of the strength.
 */
export const constrainStrengthWithinRuleBoundaries = (strength = 0, {
  logger = _logger,
  max = () => gameRules.get('armyStrengthMax'),
  maxDefault = MAX_DEFAULT,
  min = () => gameRules.get('armyStrengthMin'),
  minDefault = MIN_DEFAULT,
} = {}) => {
  let strengthMax = max()
  if (typeof strengthMax !== 'number') {
    strengthMax = maxDefault
    logger('WARNING: non-number value for max, defaulting to:', strengthMax)
  }

  let strengthMin = min()
  if (typeof strengthMin !== 'number') {
    strengthMin = minDefault
    logger('WARNING: non-number value for min, defaulting to:', strengthMin)
  }

  if (strengthMin > strengthMax) {
    throw new Error('the minimum limit should never be larger than the maximum limit, although they are allowed to be equal.')
  }

  return Math.max(strengthMin, Math.min(strength, strengthMax))
}

export default constrainStrengthWithinRuleBoundaries

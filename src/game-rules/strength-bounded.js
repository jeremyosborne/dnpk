import debug from 'debug'
import rulesGet from './get'

const logger = debug('dnpk/game-rules/strength-bounded')

// Classic values.
const DEFAULT_MIN_STRENGTH = 0
const DEFAULT_MAX_STRENGTH = 9

/**
 * Make sure a strength value is valid within the rule set.
 *
 * @param {number} strength the raw strength.
 *
 * @return {number} the constrained value of the strength.
 */
export const strengthBounded = (strength = 0) => {
  let strengthMin = rulesGet('unitStrengthMin')
  if (typeof strengthMin !== 'number') {
    strengthMin = DEFAULT_MIN_STRENGTH
    logger('WARNING: non-number rule for unitStrengthMin, defaulting to classic of', strengthMin)
  }

  let strengthMax = rulesGet('unitStrengthMax')
  if (typeof strengthMax !== 'number') {
    strengthMax = DEFAULT_MAX_STRENGTH
    logger('WARNING: non-number rule for unitStrengthMax, defaulting to classic of', strengthMax)
  }

  return Math.max(strengthMin, Math.min(strength, strengthMax))
}

export default strengthBounded

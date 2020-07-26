import debug from 'debug'
import * as gameRules from 'game-rules'

const _logger = debug('dnpk/health/constrain-health-modifier-within-rule-boundaries')

// Essentially unbounded for default
export const MAX_DEFAULT = 10000
export const MIN_DEFAULT = -10000

/**
 * Make sure a health modifier is within the allowed boundaries of the game rules,
 * or restricted to default.
 *
 * @param {number} modifier calculated elsewhere, passed here to restrict to allowed values.
 *
 * @return {number} the constrained value of the health modifier.
 */
export const constrainHealthModifierWithinRuleBoundaries = (modifier = 0, {
  logger = _logger,
  max = () => gameRules.get('armyHealthModifierMax'),
  maxDefault = MAX_DEFAULT,
  min = () => gameRules.get('armyHealthModifierMin'),
  minDefault = MIN_DEFAULT,
} = {}) => {
  let modifierMax = max()
  if (typeof modifierMax !== 'number') {
    modifierMax = maxDefault
    logger('WARNING: non-number rule for max, defaulting to:', modifierMax)
  }

  let modifierMin = min()
  if (typeof modifierMin !== 'number') {
    modifierMin = minDefault
    logger('WARNING: non-number value for min, defaulting to:', modifierMin)
  }

  if (modifierMin > modifierMax) {
    throw new Error('the minimum modifier limit should never be larger than the maximum modifier limit, although they are allowed to be equal.')
  }

  return Math.max(modifierMin, Math.min(modifier, modifierMax))
}

export default constrainHealthModifierWithinRuleBoundaries

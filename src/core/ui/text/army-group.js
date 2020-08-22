import * as gameObjectsCommon from 'game-objects-common'
import {t} from 'l10n'
import _ from 'lodash'
import _out from './out'
import {sprintf} from 'sprintf-js'
import * as simulation from 'simulation'
import * as ui from 'ui'

/**
 * Take an army group and return text information about the group.
 *
 * @param {object|object[]} armyGroup list of armies or a formal `army-group`.
 *
 * @return {string} multi-line, slightly formatted, plain text diagnostic
 * information about the army group.
 */
export const string = (armyGroup) => {
  const armies = gameObjectsCommon.armies.get(armyGroup)
  const strengthModifier = simulation.strength.armyGroup.strengthModifier({armyGroup: armies})
  const info = []
  // Overall group information.
  info.push(t('Army group bonus: {{bonus}}', {bonus: strengthModifier}))

  // Information about each unit in the army.
  armies.reduce((info, army) => {
    // Needed to calculate any accumulated strength modifications on the individual army.
    const strength = simulation.strength.army.strength({army})

    info.push(`${sprintf('%-17s', ui.text.naming.short(army))} Str: ${strength} (${simulation.strength.constrainStrengthWithinRuleBoundaries(strength + strengthModifier)})`)

    if (army.effects.length) {
      // Display army effects.
      info.push('  Effects: ' + _.map(army.effects, (eff) => {
        if (eff.name === 'brawn-terrain-modifier') {
          // Terrain modifiers have embedded meta data that gets missed when
          // displaying only the effect name.
          return `${eff.magnitude > 0 ? '+' : '-'}${_.get(eff, 'metadata.appliesTo')}`
        } else {
          return ui.text.naming.short(eff)
        }
      }).join(', '))
    }

    if (army.equipment.length) {
      // Display army inventory.
      info.push('  Equipment: ' + _.map(army.equipment, (eq) => {
        return ui.text.naming.short(eq)
      }).join(', '))
    }

    return info
  }, info)

  return info.join('\n')
}

/**
 * Direct-to-out wrapper. See `string`.
 */
export const out = (...args) => _out(string(...args))

/**
 * Convenience. See `string`.
 */
string.out = out

export default string

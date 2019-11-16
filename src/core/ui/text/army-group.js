import * as gameObjectsCommon from 'game-objects-common'
import * as gameRules from 'game-rules'
import _ from 'lodash'
import {t} from 'l10n'
import out from './out'
import {sprintf} from 'sprintf-js'
import * as simulation from 'simulation'

/**
 * Take an army group and return text information about the group.
 *
 * @param {object|object[]} armyGroup list of armies or a formal `army-group`.
 *
 * @return {string} multi-line, slightly formatted, plain text diagnostic
 * information about the army group.
 */
export const string = ({armyGroup}) => {
  let armies = Array.isArray(armyGroup) ? armyGroup : armyGroup.armies
  // Sort to make things prettier.
  armies = gameObjectsCommon.armies.sort(armies)
  const strengthModifier = simulation.strength.armyGroup.strengthModifier({armyGroup: armies})
  const info = []
  // Overall group information.
  info.push(t('Army group bonus: {{bonus}}', {bonus: strengthModifier}))

  // Information about each unit in the army.
  armies.reduce((info, army) => {
    // Needed to calculate any accumulated strength modifications on the individual army.
    const strength = simulation.strength.army.strength({army})

    info.push(`${sprintf('%-17s', gameObjectsCommon.name(army))} Str: ${strength} (${gameRules.strengthBounded(strength + strengthModifier)})`)

    if (army.effects.length) {
      // Display army effects.
      info.push('  Effects: ' + _.map(army.effects, (eff) => {
        if (eff.name === 'terrain-battle-modifier') {
          // Terrain modifiers have embedded meta data that gets missed when
          // displaying only the effect name.
          return `${eff.magnitude > 0 ? '+' : '-'}${_.get(eff, 'metadata.name')}`
        } else {
          return gameObjectsCommon.name(eff)
        }
      }).join(', '))
    }

    if (army.equipment.length) {
      // Display army inventory.
      info.push('  Equipment: ' + _.map(army.equipment, (eq) => {
        return gameObjectsCommon.name(eq)
      }).join(', '))
    }

    return info
  }, info)

  return info.join('\n')
}

/**
 * Direct-to-out wrapper. See `string`.
 */
export const armyGroup = (...args) => out(string(...args))

/**
 * Convenience. See `string`.
 */
armyGroup.string = string

export default armyGroup
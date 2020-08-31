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
  const info = []
  // Overall group information.
  const strengthModifier = simulation.strength.constrainStrengthModifierWithinRuleBoundaries(simulation.strength.armyGroup.strengthModifier({armyGroup}))
  info.push(t('Army group strength modifier: {{modifier}}', {modifier: strengthModifier}))
  const healthModifier = simulation.health.constrainHealthModifierWithinRuleBoundaries(simulation.health.armyGroup.healthModifier({armyGroup}))
  info.push(t('Army group health modifier: {{modifier}}', {modifier: healthModifier}))
  info.push('')

  // Information about each unit in the army.
  gameObjectsCommon.armies.get(armyGroup).reduce((info, army) => {
    // Needed to calculate any accumulated strength modifications on the individual army.
    const strength = simulation.strength.army.strength({army})
    const health = simulation.health.army.health({army})

    info.push(ui.text.naming.full(army))
    info.push(
      _.join(
        [
          sprintf('  %-17s', `Strength: ${strength} (${simulation.strength.constrainStrengthWithinRuleBoundaries(strength + strengthModifier)})`),
          `Health: ${health} (${simulation.health.constrainHealthWithinRuleBoundaries(health + healthModifier)})`
        ],
        ' '
      )
    )

    if (army.effects.length) {
      // Display army effects.
      info.push('  Effects: ' + _.map(army.effects, (eff) => {
        if (eff.name === 'hero') {
          // Hero bonus has a different calculation.
          const heroBonus = simulation.strength.army.strengthModifierHero({army})
          return `${heroBonus > 0 ? '+' : '-'}${Math.abs(heroBonus)} ${ui.text.naming.short(eff)}`
        } else if (eff.name === 'brawn-terrain-modifier' && eff.magnitude) {
          // Terrain modifiers have embedded meta data that gets missed when
          // displaying only the effect name.
          return `${eff.magnitude > 0 ? '+' : '-'}${Math.abs(eff.magnitude)} ${_.get(eff, 'metadata.appliesTo')}`
        } else {
          return `${eff.magnitude > 0 ? '+' : '-'}${Math.abs(eff.magnitude)} ${ui.text.naming.short(eff)}`
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

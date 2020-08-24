import * as gameObjectsCommon from 'game-objects-common'
import {t} from 'l10n'
import _ from 'lodash'
import _out from '../out'
import * as ui from 'ui'

/**
 * Transform battle events into a string of text.
 *
 * @param {object} args as dictionary
 * @param {object} [args.attackerColor='#CCCCCC'] default used to colorize attacker output.
 * @param {object} args.attackers the blob of data returned from a battle.
 * @param {object} [args.defenderColor='#FFFFFF'] default used to colorize defender output.
 * @param {object} args.defenders the blob of defender data returned from a battle.
 * @param {object[]} args.events list of battle events.
 * @param {string} [args.violenceColor='#AA0000'] optional color used for violent messages.
 *
 * @return {string} multi-line output of the battle, potentially quite lengthy.
 */
export const string = ({
  attackerColor = '#CCCCCC',
  attackers,
  defenderColor = '#FFFFFF',
  defenders,
  events,
  violenceColor = '#AA0000',
}) => {
  const info = []

  // Prefer empire metadata color vs. the color as an argument.
  attackerColor = gameObjectsCommon.cosmetics.color(_.get(attackers, 'empire')) || attackerColor
  defenderColor = gameObjectsCommon.cosmetics.color(_.get(defenders, 'empire')) || defenderColor

  events.forEach((ev) => {
    const attacker = {
      ...ev.attacker,
      // rewrite name to support colorize formatter.
      name: {
        color: attackerColor,
        label: ui.text.naming.short(ev.attacker.ref),
      },
    }
    const defender = {
      ...ev.defender,
      // rewrite name to support colorize formatter.
      name: {
        color: defenderColor,
        label: ui.text.naming.short(ev.defender.ref),
      }
    }
    if (ev.name === 'battle:round:start') {
      info.push('')
      info.push(t('{{attacker.name, colorize}} (str: {{attacker.strength}}) (health: {{attacker.health}}) vs. {{defender.name, colorize}} (str: {{defender.strength}}) (health: {{defender.health}})', {attacker, defender}))
    } else if (ev.name === 'battle:round:violence') {
      info.push(t('{{attacker.name, colorize}} (roll: {{attacker.roll}}) and {{defender.name, colorize}} (roll: {{defender.roll}})...', {attacker, defender}))
      if (attacker.damaged || defender.damaged) {
        // Assumption: no simultaneous damage allowed.
        info.push(t('...{{woundedLabel, colorize}}: {{woundedName, colorize}}', {
          woundedLabel: {color: violenceColor, label: 'wounded'},
          woundedName: attacker.damaged ? attacker.name : defender.name
        }))
      } else {
        info.push(t('...draw no blood.'))
      }
    } else if (ev.name === 'battle:round:end') {
      // Someone has zero health here.
      info.push(t('{{slainLabel, colorize}}: {{slainName, colorize}}', {
        slainLabel: {color: violenceColor, label: 'slain'},
        slainName: attacker.health === 0 ? attacker.name : defender.name
      }))
    } else {
      // Should never be seen unless an error happens.
      info.push(`WARNING: fall through due to unrecognized event name: ${ev.name}; found on event: ${JSON.stringify(ev)}`)
    }
  })

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

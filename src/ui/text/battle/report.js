import chalk from 'chalk'
import * as gameObjects from 'game-objects'
import {t} from 'l10n'
import _ from 'lodash'
import out from '../out'

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

  // If attackers or defenders is passed in as metadata, opt to grab the color
  // from there vs. the default attackerColor.
  attackerColor = _.get(attackers, 'empire.color') || attackerColor
  defenderColor = _.get(defenders, 'empire.color') || defenderColor

  events.forEach((ev) => {
    const attacker = {
      ...ev.attacker,
      name: `${chalk.hex(attackerColor)(gameObjects.common.name(ev.attacker.ref))}`,
    }
    const defender = {
      ...ev.defender,
      name: `${chalk.hex(defenderColor)(gameObjects.common.name(ev.defender.ref))}`,
    }
    const woundedText = chalk.hex(violenceColor)(t('wounded'))
    const slainText = chalk.hex(violenceColor)(t('slain'))
    if (ev.name === 'battle:round:start') {
      info.push('')
      info.push(t('{{attacker.name}} (str: {{attacker.strength}}) (health: {{attacker.health}}) vs. {{defender.name}} (str: {{defender.strength}}) (health: {{defender.health}})', {attacker, defender}))
    } else if (ev.name === 'battle:round:violence') {
      info.push(t('{{attacker.name}} (roll: {{attacker.roll}}) and {{defender.name}} (roll: {{defender.roll}})...', {attacker, defender}))
      if (attacker.damaged || defender.damaged) {
        // Assumption: no simultaneous damage allowed.
        info.push(t('...{{woundedText}}: {{wounded.name}}', {woundedText, wounded: attacker.damaged ? attacker : defender}))
      } else {
        info.push(t('...draw no blood.'))
      }
    } else if (ev.name === 'battle:round:end') {
      // Someone has zero health here.
      info.push(t('{{slainText}}: {{slain.name}}', {slain: attacker.health === 0 ? attacker : defender, slainText}))
    } else {
      // No translation since this should never happen in a real game and is for bug fixing only.
      info.push(`WARNING: fall through due to unrecognized event name: ${ev.name}; found on event: ${JSON.stringify(ev)}`)
    }
  })

  return info.join('\n')
}

/**
 * Direct-to-out wrapper. See `string`.
 */
export const report = (...args) => out(string(...args))

/**
 * Convenience. See `string`.
 */
report.string = string

export default report

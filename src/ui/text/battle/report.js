import chalk from 'chalk'
import * as gameObjects from 'game-objects'
import {t} from 'l10n'
import out from '../out'

/**
 * Transform battle events into a string of text.
 *
 * @param {object} attackerColor used to colorize attacker output.
 * @param {object} defenderColor used to colorize defender output.
 * @param {object[]} events list of battle events.
 * @param {string} violenceColor optional color used for violent messages.
 *
 * @return {string} multi-line output of the battle, potentially quite lengthy.
 */
export const string = ({
  attackerColor = '#CCCCCC',
  defenderColor = '#FFFFFF',
  events,
  violenceColor = '#AA0000',
}) => {
  const info = []

  events.forEach((ev) => {
    const attacker = {
      ...ev.attacker,
      name: `${chalk.hex(attackerColor)(gameObjects.common.name(ev.attacker.ref))}`,
    }
    const defender = {
      ...ev.defender,
      name: `${chalk.hex(defenderColor)(gameObjects.common.name(ev.defender.ref))}`,
    }
    const wounded = chalk.hex(violenceColor)(t('wounded'))
    const slain = chalk.hex(violenceColor)(t('slain'))
    if (ev.name === 'battle-round-start') {
      info.push('')
      info.push(t('{{attacker.name}} (str: {{attacker.strength}}) (health: {{attacker.health}}) vs. {{defender.name}} (str: {{defender.strength}}) (health: {{defender.health}})', {attacker, defender}))
    } else if (ev.name === 'battle-round-no-damage') {
      info.push(t('{{attacker.name}} (roll: {{attacker.roll}}) and {{defender.name}} (roll: {{defender.roll}})...', {attacker, defender}))
      info.push(t('...draw no blood.'))
    } else if (ev.name === 'battle-round-advantage-attacker') {
      info.push(t('{{attacker.name}} (roll: {{attacker.roll}}) and {{defender.name}} (roll: {{defender.roll}})...', {attacker, defender}))
      info.push(t('...{{wounded}}: {{defender.name}}', {attacker, defender, wounded}))
    } else if (ev.name === 'battle-round-advantage-defender') {
      info.push(t('{{attacker.name}} (roll: {{attacker.roll}}) wounded by {{defender.name}} (roll: {{defender.roll}}).', {attacker, defender}))
      info.push(t('...{{wounded}}: {{attacker.name}}', {attacker, defender, wounded}))
    } else if (ev.name === 'battle-round-win-defender') {
      info.push(t('{{slain}}: {{attacker.name}}', {attacker, defender, slain}))
    } else if (ev.name === 'battle-round-win-attacker') {
      info.push(t('{{slain}}: {{defender.name}}', {attacker, defender, slain}))
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

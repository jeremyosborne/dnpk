import chalk from 'chalk'
import * as textEmpire from './empire'
import * as gameObjects from 'game-objects'
import {t} from 'l10n'
import _ from 'lodash'

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
export const report = ({
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

const casualtyReport = ({survivors, casualties}) => {
  return t('survivors ({{survivors.length}}) {{survivors.names}}\ncasualties ({{casualties.length}}) {{casualties.names}}', {
    survivors: {
      length: survivors.length,
      names: _.map(survivors, (a) => gameObjects.common.name(a)).join(', '),
    },
    casualties: {
      length: casualties.length,
      names: _.map(casualties, (a) => gameObjects.common.name(a)).join(', '),
    }
  })
}

/**
 * Take the output from a `battle()` and display just the results.
 *
 * @param {object} attackers data for the aggressors.
 * @param {object[]} attackers.casualties the dead attackers.
 * @param {object} attackers.empire aggressor empire.
 * @param {object[]} attackers.survivors the aggressors surviving armies.
 * @param {object[]} defenders.casualties the dead defenders.
 * @param {object} defenders.empire defending empire.
 * @param {object[]} defenders.survivors the defenders surviving armies.
 *
 * @return {string}
 */
export const results = ({attackers, defenders}) => {
  const info = [t('Battle Results!')]

  info.push(textEmpire.title(attackers.empire))
  info.push(casualtyReport(attackers))
  info.push(textEmpire.title(defenders.empire))
  info.push(casualtyReport(defenders))

  // Built in to assume highlander rules and that, as the warning suggests, there
  // actually must be one winner.
  if (attackers.survivors.length || defenders.survivors.length) {
    const name = attackers.survivors.length
      ? chalk.hex(attackers.empire.color)(attackers.empire.name)
      : chalk.hex(defenders.empire.color)(defenders.empire.name)
    info.push(t('The {{name}} empire wins the battle!', {name}))
  } else {
    info.push(t("WARNING: All armies are dead. This shouldn't be possible."))
  }

  return info.join('\n')
}

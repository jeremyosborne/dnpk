import chalk from 'chalk'
import * as gameObjects from 'game-objects'

/**
 * Transform battle events into a string of text.
 *
 * @param {object} attackerPlayer used to colorize attacker output.
 * @param {object} defenderPlayer used to colorize defender output.
 * @param {object[]} events list of battle events.
 * @param {string} violenceColor optional color used for violent messages.
 *
 * @return {string} multi-line output of the battle, potentially quite lengthy.
 */
export const battleReport = ({
  attackerPlayer,
  defenderPlayer,
  events,
  violenceColor = '#AA0000',
}) => {
  const attackerColor = attackerPlayer.empire.color
  const defenderColor = defenderPlayer.empire.color

  const info = []

  events.forEach((ev) => {
    const {attacker, defender, name} = ev
    const attackerName = `${chalk.hex(attackerColor)(gameObjects.common.name(attacker.ref))}`
    const defenderName = `${chalk.hex(defenderColor)(gameObjects.common.name(defender.ref))}`
    if (name === 'battle-round-start') {
      info.push(`\n${attackerName} ${chalk.hex(attackerColor)('(str:' + attacker.strength + ')')} ${chalk.hex(attackerColor)('(health:' + attacker.health + ')')} vs. ${defenderName} ${chalk.hex(defenderColor)('(str:' + defender.strength + ')')} ${chalk.hex(defenderColor)('(health:' + defender.health + ')')}`)
    } else if (name === 'battle-round-no-damage') {
      info.push(`${attackerName} (roll: ${attacker.roll}) and ${defenderName} (roll: ${defender.roll}) draw no blood.`)
    } else if (name === 'battle-round-advantage-attacker') {
      info.push(`${attackerName} (roll: ${attacker.roll}) ${chalk.hex(violenceColor)('wounds')} ${defenderName} (roll: ${defender.roll}).`)
    } else if (name === 'battle-round-advantage-defender') {
      info.push(`${attackerName} (roll: ${attacker.roll}) ${chalk.hex(violenceColor)('wounded by')} ${defenderName} (roll: ${defender.roll}).`)
    } else if (name === 'battle-round-win-defender') {
      info.push(`${attackerName} ${chalk.hex(violenceColor)('slain by')} ${defenderName}.`)
    } else if (name === 'battle-round-win-attacker') {
      info.push(`${attackerName} ${chalk.hex(violenceColor)('slays')} ${defenderName}.`)
    }
  })

  return info.join('\n')
}

export default battleReport

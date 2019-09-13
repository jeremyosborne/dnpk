import chalk from 'chalk'
import * as textEmpire from './empire'
import * as gameObjects from 'game-objects'
import _ from 'lodash'

const casualtyReport = ({survivors, casualties}) => {
  return `${survivors.length} survivors${survivors.length ? ': ' + _.map(survivors, (a) => gameObjects.common.name(a)).join(', ') : ''}
${casualties.length} casualties${casualties.length ? ': ' + _.map(casualties, (a) => gameObjects.common.name(a)).join(', ') : ''}`
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
export const battleResults = ({attackers, defenders}) => {
  const info = []

  info.push(textEmpire.title(attackers.empire))
  info.push(casualtyReport(attackers))
  info.push(textEmpire.title(defenders.empire))
  info.push(casualtyReport(defenders))

  // Built in to assume highlander rules and that, as the warning suggests, there
  // actually must be one winner.
  if (attackers.survivors.length) {
    info.push(`The ${chalk.hex(attackers.empire.color)(attackers.empire.name)} empire wins the battle!`)
  } else if (defenders.survivors.length) {
    info.push(`The ${chalk.hex(defenders.empire.color)(defenders.empire.name)} empire wins the battle!`)
  } else {
    info.push("All armies are dead. WARNING: This shouldn't be possible to reach.")
  }

  return info.join('\n')
}

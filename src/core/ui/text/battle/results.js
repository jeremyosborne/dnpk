import * as textEmpire from '../empire'
import * as textNaming from '../naming'
import {t} from 'l10n'
import out from '../out'

const casualtyReport = ({survivors, casualties}) => {
  return t('survivors ({{survivors.length}}) {{survivors}}\ncasualties ({{casualties.length}}) {{casualties}}', {
    survivors: textNaming.short.string(survivors),
    casualties: textNaming.short.string(casualties),
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
export const string = ({attackers, defenders}) => {
  const info = [t('Battle Results')]

  info.push(textEmpire.title.string(attackers))
  info.push(casualtyReport(attackers))
  info.push(textEmpire.title.string(defenders))
  info.push(casualtyReport(defenders))

  // Built in to assume highlander rules and that, as the warning suggests, there
  // actually must be one winner.
  if (attackers.survivors.length || defenders.survivors.length) {
    const name = attackers.survivors.length
      ? textEmpire.title.string(attackers)
      : textEmpire.title.string(defenders)
    info.push(t('The {{name}} empire wins the battle!', {name}))
  } else {
    info.push(t("WARNING: All armies are dead. This shouldn't be possible."))
  }

  return info.join('\n')
}

/**
 * Direct-to-out wrapper. See `string`.
 */
export const results = (...args) => out(string(...args))

/**
 * Convenience. See `string`.
 */
results.string = string

export default results

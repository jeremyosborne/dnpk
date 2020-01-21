import * as dataSourceGame from 'meat-grinder/data-source-game'
import hitReturnToContinue from 'hit-return-to-continue'
import _ from 'lodash'
import out from 'out'

/**
 * Display any (morbid) score keeping done by the meat grinder.
 *
 * @return {Promise}
 */
export const mausoleum = async () => {
  const deaths = dataSourceGame.counterDead.sum()
  out.t('{{count}} have fallen for your cause.', {count: deaths})
  if (deaths) {
    const deads = _.slice(dataSourceGame.counterDead.sorted())
    out.t('Numbering your dead:')
    _.forEach(deads, ([label, value]) => {
      out.t('\t{{label}}: {{value}}', {label, value})
    })
  }

  out('')

  const kills = dataSourceGame.counterKills.sum()
  out.t('{{count}} have been vanquished by your forces.', {count: kills})
  if (kills) {
    const killeds = _.slice(dataSourceGame.counterKills.sorted())
    out.t('Numbering your fallen foes:')
    _.forEach(killeds, ([label, value]) => {
      out.t('\t{{label}}: {{value}}', {label, value})
    })
  }

  await hitReturnToContinue()
}

export default mausoleum

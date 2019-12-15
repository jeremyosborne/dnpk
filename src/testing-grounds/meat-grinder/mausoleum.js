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
  const deaths = dataSourceGame.deadCounter.sum()
  out.t('{{count}} have fallen for your cause.', {count: deaths})
  if (deaths) {
    const deads = _.slice(dataSourceGame.deadCounter.sorted())
    out.t('Numbering your dead:')
    _.forEach(deads, (d) => {
      out.t('\t{{label}}: {{value}}', d)
    })
  }

  out('')

  const kills = dataSourceGame.killCounter.sum()
  out.t('{{count}} have been vanquished by your forces.', {count: kills})
  if (kills) {
    const killeds = _.slice(dataSourceGame.deadCounter.sorted())
    out.t('Numbering your fallen foes:')
    _.forEach(killeds, (k) => {
      out.t('\t{{label}}: {{value}}', k)
    })
  }

  await hitReturnToContinue()
}

export default mausoleum

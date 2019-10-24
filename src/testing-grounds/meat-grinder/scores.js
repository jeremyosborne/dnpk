//
// Meat grinder: an almost idle adventure for the testing-grounds to try out
// prose, storyboarding, rules, mechanics, and act as an old god, throwing
// the mortals into the hell of battle.
//
// Flow:
//
// - Entry Requirement: Player must have a protagonist.
// - Entry Requirement: Player must have an army-group.
//

import * as dataSourceGame from 'data-source-game'
import hitReturnToContinue from 'hit-return-to-continue'
import _ from 'lodash'
import out from 'out'

export const scores = async () => {
  const deaths = dataSourceGame.deadCounter.sum()
  out.t('Total army deaths: {{count}}', {count: deaths})
  if (deaths) {
    const deads = _.slice(dataSourceGame.deadCounter.sorted(), 0, 5)
    out.t('Top {{count}} cannon foddered units:', {count: deads.length})
    _.forEach(deads, (d) => {
      out.t('\t{{label}}: {{value}}', d)
    })
  }

  out('')

  const kills = dataSourceGame.killCounter.sum()
  out.t('Total army kills: {{count}}', {count: kills})
  if (kills) {
    const killeds = _.slice(dataSourceGame.deadCounter.sorted(), 0, 5)
    out.t('Top {{count}} opposing forces killed:', {count: killeds.length})
    _.forEach(killeds, (k) => {
      out.t('\t{{label}}: {{value}}', k)
    })
  }

  await hitReturnToContinue()
}

export default scores

import * as dataSourceGame from 'data-source-game'
import hitReturnToContinue from 'hit-return-to-continue'
import * as gameObjects from 'game-objects'
import * as gameObjectsCommon from 'game-objects-common'
import _ from 'lodash'
import * as nameIndex from './name-index'
import out from 'out'
import * as wrappers from './wrappers'

import type {NextScene} from './flow-types'

const SHRINE_NAMES = [
  'Tlorok'
]

const hasBlessing = (army, shrineName) => {
  return _.some(_.get(army, 'effects'), (effect) => _.get(effect, `metadata.name`) === shrineName)
}

const addBlessing = (army, shrineName) => {
  const blessing = gameObjects.effect.create({name: 'brawn'})
  // Additional shrine meta-info.
  _.set(blessing, 'metadata.name', shrineName)
  gameObjectsCommon.effects.add(army, blessing)
}

export const scene = async (): NextScene => {
  const protagonist = dataSourceGame.protagonist.get()
  const armyGroup = _.get(protagonist, 'armyGroups[0]')
  const shrineName = _.sample(SHRINE_NAMES)

  out.t('You come upon the shrine of {{shrineName}}. Your armies will be blessed.', {shrineName})
  const armies = Array.isArray(armyGroup) ? armyGroup : armyGroup.armies
  _.forEach(armies, (army) => {
    if (hasBlessing(army, shrineName)) {
      out.t('{{army, commonName}} already has the blessing of {{shrineName}}.', {army, shrineName})
    } else {
      addBlessing(army, shrineName)
      out.t('{{army, commonName}} receives the blessing of {{shrineName}}.', {army, shrineName})
    }
  })

  await hitReturnToContinue()

  dataSourceGame.protagonist.save({armyGroups: [armyGroup]})

  // After a shrine, you're doomed to fight ;)
  return nameIndex.FIGHT
}

export default _.flow([
  wrappers.throwIfNoEmpire,
  wrappers.throwIfNoArmyGroup,
])(scene)

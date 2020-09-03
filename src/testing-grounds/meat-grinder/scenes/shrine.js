import * as dataSourceGame from 'meat-grinder/data-source-game'
import hitReturnToContinue from 'hit-return-to-continue'
import * as gameObjectsCommon from 'game-objects-common'
import _ from 'lodash'
import * as sceneChoices from './scene-choices'
import out from 'out'
import * as ui from 'ui'
import * as wrappers from './wrappers'

/**
 * Buff the armies within the army-group before continuing on.
 *
 * Blessings come from a particular deity, and each army may receive only one
 * blessing from a particular deity.
 *
 * @return {NextScene}
 */
export const scene = async ({protagonist: {armyGroup}, terrain, turn}) => {
  const deity = _.sample(gameObjectsCommon.dir('deity'))

  // Deity official names can have some funky characters.
  out.t('You come upon the shrine of {{- deity}} surrounded by {{terrain}}. Your worthy armies will be blessed.', {deity: ui.text.naming.short(deity), terrain: ui.text.naming.short(terrain)})
  const armies = Array.isArray(armyGroup) ? armyGroup : armyGroup.armies
  _.forEach(armies, (army) => {
    if (gameObjectsCommon.effects.blessings.has(army, deity)) {
      out.t('{{army}} already has the blessing of {{- deity}}.', {army: ui.text.naming.short(army), deity: ui.text.naming.short(deity)})
    } else {
      gameObjectsCommon.effects.blessings.add(army, deity)
      out.t('{{army}} receives the blessing of {{- deity}}.', {army: ui.text.naming.short(army), deity})
    }
  })

  await hitReturnToContinue()

  dataSourceGame.protagonist.save({armyGroups: [armyGroup]})

  // Time to test out that training ;)
  return sceneChoices.violent()
}

export default _.flowRight([
  wrappers.throwIfNoEmpire,
  wrappers.throwIfNoArmyGroup,
  wrappers.uiWhiteSpace,
  wrappers.uiGameTurn,
  // wrappers.uiTerrain, reflected in the existing description.
])(scene)

// @flow
import * as dataSourceGame from 'meat-grinder/data-source-game'
import hitReturnToContinue from 'hit-return-to-continue'
// import * as gameObjects from 'game-objects'
import * as gameObjectsCommon from 'game-objects-common'
// import * as gameRules from 'game-rules'
import _ from 'lodash'
import out from 'out'
// import * as random from 'random'
// import * as sceneChoices from './scene-choices'
import * as simulation from 'simulation'
// import * as ui from 'ui'
import * as wrappers from './wrappers'

import type {
  GameState,
  NextScene,
} from '../types'

/**
 * You find a new equippable.
 *
 * @return {NextScene}
 */
export const scene = async ({terrain, turn}: GameState): NextScene => {
  const armyGroup = dataSourceGame.protagonist.getArmyGroup()
  const heroes = _.filter(gameObjectsCommon.armies.get(armyGroup), (army) => gameObjectsCommon.effects.hasName(army, 'hero'))
  // const vault = dataSourceGame.equipmentVault.get()

  const artifact = simulation.createRandom({type: 'equippable'})

  out.t('{{artifact, commonName}} lies on the ground.', {artifact})

  if (!heroes.length) {
    out.t('Lacking any heroic armies able to pick up the artifact, eldritch tendrils zap the artifact to your vault-o-matic.')
    //
    // TODO: Add the item to the vault and save the vault.
    //
    // and return
  }

  // You have at least one hero in your army.
  _.forEach(heroes, (hero) => {
    out.t('{{hero, commonName}} equipment: {{equipment, commonName}}', {hero, equipment: hero.equipment, count: hero.equipment.length})
  })

  hitReturnToContinue()

  //
  // TODO enter equipment menu.
  //
  // 1) Pick which hero will pick up the item.
  //
  // Submenu to pick a hero.
  // Submenu to pick item from either vault or hero.
  // Transaction only happens after all choices are made and data is saved to vault and protagonist.
}

export default _.flowRight([
  wrappers.throwIfNoEmpire,
  wrappers.throwIfNoArmyGroup,
  wrappers.uiWhiteSpace,
  wrappers.uiGameTurn,
  wrappers.uiTerrain,
])(scene)

// @flow
import * as dataSourceGame from 'meat-grinder/data-source-game'
import hitReturnToContinue from 'hit-return-to-continue'
// import * as gameObjects from 'game-objects'
import * as gameObjectsCommon from 'game-objects-common'
// import * as gameRules from 'game-rules'
import _ from 'lodash'
import out from 'out'
// import * as random from 'random'
import * as sceneChoices from './scene-choices'
// import * as simulation from 'simulation'
// import * as ui from 'ui'
import * as wrappers from './wrappers'

import type {
  GameState,
  NextScene,
} from '../types'

/**
 * A visit to the vault-o-matic.
 *
 * If you have any heroes in your army, you can equip or unequip them.
 *
 * @return {NextScene}
 */
export const scene = async ({terrain, turn}: GameState): NextScene => {
  const armyGroup = dataSourceGame.protagonist.getArmyGroup()
  const heroes = _.filter(gameObjectsCommon.armies.get(armyGroup), (army) => gameObjectsCommon.effects.hasName(army, 'hero'))
  const heroesHaveEquipment = _.some(heroes, (army) => gameObjectsCommon.equipment.size(army))
  const vault = dataSourceGame.equipmentVault.get()

  out.t('A vault-o-matic hums nearby, providing storage of and transdimensional, secure access to acquired items.')

  const carryOn = async () => {
    out.t('You carry on.')
    await hitReturnToContinue()
    return sceneChoices.intermission()
  }

  if (!heroes.length && !vault.length) {
    out.t('You have no heroes and your vault is empty.')
    return carryOn()
  } else if (!heroes.length && vault.length) {
    out.t('You have no heroes to wield the items in your vault.')
    out.t('(The video game logic in this world prevents normal troops from wielding artifacts.)')
    return carryOn()
  } else if (heroes.length && !heroesHaveEquipment && !vault.length) {
    out.t('Your vault is empty and your heroes have no items.')
    return carryOn()
  }

  // You have at least one hero, and your heroes or vault have at least 1 item.
  out.t('Vault contents: {{equipment, commonName}}', {equipment: vault, count: vault.length})
  _.forEach(heroes, (hero) => {
    out.t('{{hero, commonName}} equipment: {{equipment, commonName}}', {hero, equipment: hero.equipment, count: hero.equipment.length})
  })

  hitReturnToContinue()

  //
  // TODO enter equipment menu.
  //
  // 1) Add equipment to hero from vault.
  // 2) Add equipment to vault from hero.
  // 3) If more than 1 hero, take equipment from one hero, add to another.
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

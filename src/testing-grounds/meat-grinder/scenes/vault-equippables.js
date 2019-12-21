// @flow
import {prompt} from 'enquirer'
import * as gameObjectsCommon from 'game-objects-common'
import hitReturnToContinue from 'hit-return-to-continue'
import {t} from 'l10n'
import _ from 'lodash'
import * as dataSourceGame from 'meat-grinder/data-source-game'
import out from 'out'
import * as sceneChoices from './scene-choices'
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
  const vault = dataSourceGame.vaultEquippables.get()

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

  const equippableCandidatesMap = {
    // Vault doesn't have an id at the moment so we make it act like one of the regular
    // objects with an id that should never collide.
    __vault: {
      id: '__vault',
      // Makes it look nice.
      name: 'Vault',
      equipment: vault,
    },

    ..._.reduce(heroes, (idMap, hero) => {
      idMap[hero.id] = hero
      return idMap
    }, {})
  }

  // Filters the from list down based on who actually has equipment, because only
  // they can donate.
  // Returns an enquirer friendly set of menu choices.
  const equipmentCandidatesFromChoices = () => {
    // Who has items within their inventory?
    const candidates = _.filter(equippableCandidatesMap, (c) => gameObjectsCommon.equipment.size(c))
    return _.map(candidates, (from) => ({
      message: t('{{from, commonName}}', {from}),
      // Reference by id, including the psuedo-vault wrapper we made up.
      name: from.id,
    }))
  }

  // Takes a candidate and formats the equipment choices for transfer.
  const equippableCandidatesChoices = (candidate) => {
    // Assume we're only dealing with equipment right now.
    return _.map(candidate.equipment, (eq) => ({
      message: t('{{eq, commonName}}', {eq}),
      name: eq.id,
    }))
  }

  // Filters out candidates who we shouldn't choose, assuming whoever is left could
  // be chosen.
  const equipmentCandidatesToChoices = (filtered) => {
    // Who has items within their inventory?
    const candidates = _.filter(equippableCandidatesMap, (c) => c.id !== filtered.id)
    return _.map(candidates, (from) => ({
      message: t('{{from, commonName}}', {from}),
      // Reference by id, including the psuedo-vault wrapper we made up.
      name: from.id,
    }))
  }

  //
  // TODO: document better
  // TODO: break into subroutines
  // TODO: make this loop until done
  //

  out('') // spacer
  const {id: fromId} = await prompt({
    type: 'select',
    message: t('Transfer from?'),
    name: 'id',
    choices: equipmentCandidatesFromChoices(),
  })
  const from = equippableCandidatesMap[fromId]

  out('') // spacer
  const {id: equipmentId} = await prompt({
    type: 'select',
    message: t('Which object?'),
    name: 'id',
    choices: equippableCandidatesChoices(from),
  })
  const toTransfer = gameObjectsCommon.equipment.find(from, {id: equipmentId})

  out('') // spacer
  const {id: toId} = await prompt({
    type: 'select',
    message: t('Transfer to?'),
    name: 'id',
    choices: equipmentCandidatesToChoices(equippableCandidatesMap[fromId]),
  })
  const to = equippableCandidatesMap[toId]

  // Perform the transfer.
  gameObjectsCommon.equipment.transfer(toTransfer, from, to)
  // Save everything as vault and armies are in different locations.
  dataSourceGame.write()

  out.t('{{object, commonName}} transferred from {{from, commonName}} to {{to, commonName}}', {
    object: toTransfer,
    from,
    to,
  })
  await hitReturnToContinue()

  return sceneChoices.intermission()
}

export default _.flowRight([
  wrappers.throwIfNoEmpire,
  wrappers.throwIfNoArmyGroup,
  wrappers.uiWhiteSpace,
  wrappers.uiGameTurn,
  wrappers.uiTerrain,
])(scene)

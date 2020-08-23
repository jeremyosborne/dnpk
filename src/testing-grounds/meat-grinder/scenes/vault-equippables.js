import {prompt} from 'enquirer'
import * as gameObjectsCommon from 'game-objects-common'
import hitReturnToContinue from 'hit-return-to-continue'
import {t} from 'l10n'
import _ from 'lodash'
import * as dataSourceGame from 'meat-grinder/data-source-game'
import out from 'out'
import * as sceneChoices from './scene-choices'
import * as ui from 'ui'
import * as wrappers from './wrappers'

/**
 * A visit to the vault-o-matic.
 *
 * If you have any heroes in your army, you can equip or unequip them.
 *
 * @return {NextScene}
 */
export const scene = async ({protagonist: {armyGroup}, terrain, turn}) => {
  const heroes = _.filter(gameObjectsCommon.armies.get(armyGroup), (army) => gameObjectsCommon.effects.hasName(army, 'hero'))
  const heroesHaveEquipment = _.some(heroes, (army) => gameObjectsCommon.equipment.size(army))
  const vault = dataSourceGame.vaultEquippables.get()

  out.t('A vault-o-matic hums nearby, providing storage of and transdimensional, secure access to acquired items.')

  //
  // Prerequisites:
  // Make sure that we have a vault, at least one hero, and at least one item
  // to trade betweent the two.
  //
  // Any of the prereq failures will call this method to exit out.
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

  //
  // Prerequisites met. You can transfer items between your heroes and vault.
  //

  // Organize items that can hold equippables.
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
      message: t('{{from}}', {from: ui.text.naming.short(from)}),
      // Reference by id, including the psuedo-vault wrapper we made up.
      name: from.id,
    }))
  }

  // Takes a candidate and formats the equipment choices for transfer.
  const equippableCandidatesChoices = (candidate) => {
    // Assume we're only dealing with equipment right now.
    return _.map(candidate.equipment, (eq) => ({
      message: t('{{eq}}', {eq: ui.text.naming.short(eq)}),
      name: eq.id,
    }))
  }

  // Filters out candidates who we shouldn't choose, assuming whoever is left could
  // be chosen.
  const equipmentCandidatesToChoices = (filtered) => {
    // Who has items within their inventory?
    const candidates = _.filter(equippableCandidatesMap, (c) => c.id !== filtered.id)
    return _.map(candidates, (from) => ({
      message: t('{{from}}', {from: ui.text.naming.short(from)}),
      // Reference by id, including the psuedo-vault wrapper we made up.
      name: from.id,
    }))
  }

  // We will continue this loop until the user exits.
  let stillEquipping = true
  while (stillEquipping) {
    // Game should limit how many heroes we have so this display shouldn't get out of hand.
    _.forEach(equippableCandidatesMap, (container) => {
      const equipment = gameObjectsCommon.equipment.get(container)
      if (gameObjectsCommon.equipment.size(equipment)) {
        out.t('{{container}}: {{equipment}}', {container: ui.text.naming.short(container), equipment: ui.text.naming.short(equipment)})
      } else {
        out.t('{{container}}: no equipment', {container: ui.text.naming.short(container)})
      }
    })

    out('') // spacer
    const {action} = await prompt({
      type: 'select',
      message: t('Transfer equipment'),
      name: 'action',
      choices: [
        {message: t('Yes, transfer equipment'), name: 'transfer'},
        {message: t('No, carry on with the adventure'), name: 'carry-on'},
      ],
    })

    if (action === 'transfer') {
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

      out.t('{{object}} transferred from {{from}} to {{to}}', {
        object: ui.text.naming.short(toTransfer),
        from: ui.text.naming.short(from),
        to: ui.text.naming.short(from),
      })
      await hitReturnToContinue()
    } else {
      // We're done.
      stillEquipping = false
    }
  }

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

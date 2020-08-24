//
// Common fight functions.
//
import {battle} from 'simulation/battle'
import * as dataSourceGame from 'meat-grinder/data-source-game'
import * as gameObjectsCommon from 'game-objects-common'
import hitReturnToContinue from 'hit-return-to-continue'
import {t} from 'l10n'
import _ from 'lodash'
import out from 'out'
import * as sceneChoices from './scene-choices'
import * as ui from 'ui'
import * as wrappers from './wrappers'

/**
 * Transform battle events into a string of text.
 *
 * @param {object} args as dictionary
 * @param {object} [args.attackerColor='#DDDDDD'] default used to colorize attacker output.
 * @param {object} [args.defenderColor='#FFFFFF'] default used to colorize defender output.
 * @param {object[]} args.events list of battle events.
 * @param {string} [args.violenceColor='#AA0000'] optional color used for violent messages.
 *
 * @return {string} multi-line output of the battle, potentially quite lengthy.
 */
export const battleReport = function * ({
  attackerColor = '#CCCCCC',
  defenderColor = '#FFFFFF',
  events,
  violenceColor = '#AA0000',
}) {
  let info = []

  for (let i = 0; i < events.length; i++) {
    const ev = events[i]
    const attacker = {
      ...ev.attacker,
      // rewrite name to support colorize formatter.
      name: {
        color: attackerColor,
        label: ui.text.naming.short(ev.attacker.ref),
      },
    }
    const defender = {
      ...ev.defender,
      // rewrite name to support colorize formatter.
      name: {
        color: defenderColor,
        label: ui.text.naming.short(ev.defender.ref),
      }
    }
    if (ev.name === 'battle:round:start') {
      info.push('')
      info.push(t('{{attacker.name, colorize}} (str: {{attacker.strength}}) (health: {{attacker.health}}) vs. {{defender.name, colorize}} (str: {{defender.strength}}) (health: {{defender.health}})', {attacker, defender}))
    } else if (ev.name === 'battle:round:violence') {
      info.push(t('{{attacker.name, colorize}} (roll: {{attacker.roll}}) and {{defender.name, colorize}} (roll: {{defender.roll}})...', {attacker, defender}))
      if (attacker.damaged || defender.damaged) {
        // Assumption: no simultaneous damage allowed.
        info.push(t('...{{woundedLabel, colorize}}: {{woundedName, colorize}}', {
          woundedLabel: {color: violenceColor, label: 'wounded'},
          woundedName: attacker.damaged ? attacker.name : defender.name
        }))
      } else {
        info.push(t('...draw no blood.'))
      }
    } else if (ev.name === 'battle:round:end') {
      // Someone has zero health here.
      info.push(t('{{slainLabel, colorize}}: {{slainName, colorize}}', {
        slainLabel: {color: violenceColor, label: 'slain'},
        slainName: attacker.health === 0 ? attacker.name : defender.name
      }))

      // Round is done, return and reset.
      yield info.join('\n')
      info = []
    } else {
      // Should never be seen unless an error happens.
      throw new Error(`WARNING: fall through due to unrecognized event name: ${ev.name}; found on event: ${JSON.stringify(ev)}`)
    }
  }
  if (info.length) {
    throw new Error(`Battle report had unterminated battles. Info contains: ${JSON.stringify(info)}`)
  }
}

/**
 * Generate a fight scene function.
 *
 * Takes a createAntagonist function that must return the expected antagonist data.
 */
export const createScene = ({createAntagonist}) => _.flowRight([
  wrappers.throwIfNoArmyGroup,
  wrappers.throwIfNoEmpire,
  wrappers.uiWhiteSpace,
  wrappers.uiGameTurn,
  wrappers.uiTerrain,
])(async ({protagonist, terrain}) => {
  const protagonistEmpire = protagonist.empire
  let protagonistArmyGroup = protagonist.armyGroup
  const protagonistFlag = ui.text.flag(protagonistEmpire)

  const {
    antagonist: {
      empire: antagonistEmpire,
      armyGroup: antagonistArmyGroup,
      structures: antagonistStructures,
    },
    messages,
  } = createAntagonist({protagonist})
  const antagonistFlag = ui.text.flag(antagonistEmpire)

  out(messages.prelude)

  // Fight code common to the meat grinder battles below.
  out.t("It's a fight.")
  out.t('')
  out.t('{{flag}} ({{armyGroup}})', {armyGroup: ui.text.naming.short(protagonistArmyGroup), flag: protagonistFlag})
  out.t('vs.')
  out.t('{{flag}} ({{armyGroup}})', {armyGroup: ui.text.naming.short(antagonistArmyGroup), flag: antagonistFlag})
  out.t('')
  await hitReturnToContinue('Hit return to charge into battle!')

  const {
    attackers,
    defenders,
    events,
  } = battle({
    attackers: {
      armyGroup: protagonistArmyGroup,
      empire: protagonistEmpire,
    },
    defenders: {
      armyGroup: antagonistArmyGroup,
      empire: antagonistEmpire,
      structures: antagonistStructures,
    },
    terrains: [terrain],
  })

  for (const messageChunk of battleReport({
    attackerColor: gameObjectsCommon.cosmetics.color(protagonistEmpire),
    defenderColor: gameObjectsCommon.cosmetics.color(antagonistEmpire),
    events,
  })) {
    out(messageChunk)
    await hitReturnToContinue(t('\n...more'))
  }

  out('')

  out.t('{{winner}} defeats {{loser}}', attackers.survivors.length
    ? {winner: protagonistFlag, loser: antagonistFlag}
    : {winner: antagonistFlag, loser: protagonistFlag}
  )

  const {casualties, equipment} = gameObjectsCommon.armies.kill({
    armyGroup: protagonistArmyGroup,
    casualties: attackers.casualties,
  })

  // By nature of the current rules, if the opposing team survives, they win.
  if (defenders.survivors.length) {
    out.t('The opposing forces stand triumphant: ({{armyGroup}})', {armyGroup: ui.text.naming.short(defenders.survivors)})
  } else {
    out.t('The opposing forces have been destroyed.')
  }
  if (defenders.casualties.length) {
    out.t('Your armies destroyed the opposing troops: ({{armyGroup}})', {armyGroup: ui.text.naming.short(defenders.casualties)})
  } else {
    out.t('The opposing force made it through this battle unscatched.')
  }

  if (casualties.length) {
    out.t('A moment of silence for your fallen: ({{armyGroup}})', {armyGroup: ui.text.naming.short(casualties)})
  } else {
    out.t('Your troops made it through this battle unscathed.')
  }

  if (equipment.length) {
    _.forEach(equipment, (equippable) => dataSourceGame.vaultEquippables.add(equippable))
    out.t('{{equipment}} shimmer away and teleport to the equipment vault.', {equipment: ui.text.naming.short(equipment)})
  }

  if (gameObjectsCommon.armies.size(protagonistArmyGroup)) {
    out.t('Your remaining troops march on: ({{armyGroup}})', {armyGroup: ui.text.naming.short(protagonistArmyGroup)})
  } else {
    out.t('You have been defeated.')
  }

  // record kills and deaths.
  _.forEach(attackers.casualties, (dead) => {
    dataSourceGame.counterDead.add(dead.name)
  })
  _.forEach(defenders.casualties, (killed) => {
    dataSourceGame.counterKills.add(killed.name)
  })

  // Save the updated results.
  protagonistArmyGroup = gameObjectsCommon.armies.sort(protagonistArmyGroup)
  dataSourceGame.protagonist.set({armyGroups: [protagonistArmyGroup]})

  out('\n\n')

  await hitReturnToContinue()

  return sceneChoices.intermission()
})

export default createScene

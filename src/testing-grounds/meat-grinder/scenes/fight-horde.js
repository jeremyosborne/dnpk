// @flow
import {battle} from 'battle'
import * as dataSourceGame from 'meat-grinder/data-source-game'
import * as gameObjects from 'game-objects'
import * as gameObjectsCommon from 'game-objects-common'
import hitReturnToContinue from 'hit-return-to-continue'
import _ from 'lodash'
import out from 'out'
import * as random from 'random'
import * as sceneChoices from './scene-choices'
import * as simulation from 'simulation'
import * as ui from 'ui'
import * as wrappers from './wrappers'

import type {
  GameState,
  NextScene,
} from '../types'

/**
 * Put the protagonist's army-group through one random encounter style battle
 * with a horde of monsters.
 *
 *     "The DM rolls for a random encounter,
 *         and lo you are beset by many, many goblins."
 */
export const scene = async ({terrain, turn}: GameState): NextScene => {
  const protagonist = dataSourceGame.protagonist.get()
  const protagonistEmpire = protagonist.empire
  let protagonistArmyGroup = protagonist.armyGroups[0]
  const protagonistFlag = ui.text.empire.flag.string({empire: protagonistEmpire})

  const antagonistEmpire = simulation.createRandom({
    exclude: [protagonist.empire.name],
    type: 'empire',
  })
  // For the HORDE!
  const antagonistArmyGroup = _.times(random.randint(15, 25), () => {
    const army = gameObjects.army.create({name: 'light-infantry'})
    // In our horde scenario, the armies are significantly weaker. Maybe
    // they are wanderers or starving or exiled weaklings.
    army.strength = random.randint(1, 3)
    army.health = 1
    return army
  })
  const antagonistFlag = ui.text.empire.flag.string({empire: antagonistEmpire})

  // Engage the 2 groups in battle.

  out.t('A horde of {{empire, commonName}} forces gather here.', {empire: antagonistEmpire})
  out.t('There are many of them.')
  out.t('')
  out.t('{{flag}} ({{armyGroup, commonName}})', {armyGroup: protagonistArmyGroup, flag: protagonistFlag})
  out.t('vs.')
  // Special call out for the horde since they're all the same type: light-infantry.
  out.t('{{flag}} ({{armyGroup, commonName}}) x{{count}}', {armyGroup: antagonistArmyGroup[0], flag: antagonistFlag, count: antagonistArmyGroup.length})
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
    },
    terrain,
  })

  ui.text.battle.report({attackerColor: protagonistEmpire.color, defenderColor: antagonistEmpire.color, events})

  out('')

  out.t('{{winner}} defeats {{loser}}', attackers.survivors.length
    ? {winner: protagonistFlag, loser: antagonistFlag}
    : {winner: antagonistFlag, loser: protagonistFlag}
  )

  const {casualties, equipment} = gameObjectsCommon.armies.kill({
    armyGroup: protagonistArmyGroup,
    casualties: attackers.casualties,
  })

  if (casualties.length) {
    out.t('A moment of silence for your fallen: {{armyGroup, commonName}}', {armyGroup: casualties})
  } else {
    out.t('Your troops made it through this battle unscathed.')
  }

  if (equipment.length) {
    _.forEach(equipment, (equippable) => dataSourceGame.vaultEquippables.add(equippable))
    out.t('{{equipment, commonName}} shimmer away and teleport to the equipment vault.', {equipment})
  }

  if (gameObjectsCommon.armies.size(protagonistArmyGroup)) {
    out.t('Your ({{armyGroup, commonName}}) scavenge supplies and march on.', {armyGroup: protagonistArmyGroup})
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

  // Write everything at once.
  await dataSourceGame.write()

  out('\n\n')

  await hitReturnToContinue()

  return sceneChoices.intermission()
}

export default _.flowRight([
  wrappers.throwIfNoArmyGroup,
  wrappers.throwIfNoEmpire,
  wrappers.uiWhiteSpace,
  wrappers.uiGameTurn,
  wrappers.uiTerrain,
])(scene)
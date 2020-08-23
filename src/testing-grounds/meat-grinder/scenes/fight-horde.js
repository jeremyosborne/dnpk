import {battle} from 'simulation/battle'
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

/**
 * Put the protagonist's army-group through one random encounter style battle
 * with a horde of monsters.
 *
 *     "The DM rolls for a random encounter,
 *         and lo you are beset by many, many goblins."
 */
export const scene = async ({protagonist, terrain, turn}) => {
  const protagonistEmpire = protagonist.empire
  let protagonistArmyGroup = protagonist.armyGroup
  const protagonistFlag = ui.text.flag(protagonistEmpire)

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
  const antagonistFlag = ui.text.flag(antagonistEmpire)

  // Engage the 2 groups in battle.

  out.t('A horde of {{empire}} forces gather here.', {empire: ui.text.naming.short(antagonistEmpire)})
  out.t('There are many of them.')
  out.t('')
  out.t('{{flag}} ({{armyGroup}})', {armyGroup: ui.text.naming.short(protagonistArmyGroup), flag: protagonistFlag})
  out.t('vs.')
  // Special call out for the horde since they're all the same type: light-infantry.
  out.t('{{flag}} ({{armyGroup}}) x{{count}}', {armyGroup: ui.text.naming.short(antagonistArmyGroup[0]), flag: antagonistFlag, count: antagonistArmyGroup.length})
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
    terrains: [terrain],
  })

  ui.text.battle.report({attackerColor: gameObjectsCommon.cosmetics.color(protagonistEmpire), defenderColor: gameObjectsCommon.cosmetics.color(antagonistEmpire), events})

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
    out.t('The opposing forces ({{armyGroup}}) stand triumphant.', {armyGroup: ui.text.naming.short(defenders.survivors)})
  } else {
    out.t('The opposing forces have been destroyed.')
  }
  if (defenders.casualties.length) {
    out.t('Your armies destroyed ({{armyGroup}}) of the opposing force.', {armyGroup: ui.text.naming.short(defenders.casualties)})
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
    out.t('Your ({{armyGroup}}) scavenge supplies and march on.', {armyGroup: ui.text.naming.short(protagonistArmyGroup)})
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
}

export default _.flowRight([
  wrappers.throwIfNoArmyGroup,
  wrappers.throwIfNoEmpire,
  wrappers.uiWhiteSpace,
  wrappers.uiGameTurn,
  wrappers.uiTerrain,
])(scene)

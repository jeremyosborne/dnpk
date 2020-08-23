import {battle} from 'simulation/battle'
import * as dataSourceGame from 'meat-grinder/data-source-game'
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
 * Put the protagonist's army-group through a battle with them sieging a city.
 *
 *     "The DM, ecstatic you played along with the narrative and stopped
 *         brawling in the bar, announces your likely demise at the siege
 *             of the Fortress of Marthos.""
 */
export const scene = async ({protagonist, terrain, turn}) => {
  const protagonistEmpire = protagonist.empire
  let protagonistArmyGroup = protagonist.armyGroup
  const protagonistFlag = ui.text.flag(protagonistEmpire)

  const antagonistEmpire = simulation.createRandom({
    exclude: [protagonist.empire.name],
    type: 'empire',
  })
  // This version of a city siege is against more common troops.
  // Appropriate as we joke in the code that it's the Sirian's homebase.
  const exclude = _.filter(gameObjectsCommon.def('army'), (aDef) => {
    if (
      gameObjectsCommon.effects.hasName(aDef, 'aerial') ||
      gameObjectsCommon.effects.hasName(aDef, 'elite') ||
      gameObjectsCommon.is.hero(aDef)
    ) {
      return true
    } else {
      return false
    }
  }).map((aDef) => aDef.name)
  const antagonistArmyGroup = simulation.createRandomWeightedArmyGroup({
    exclude,
    // Big money, big prizes, I love it!
    // The chance of an army surviving this should be low.
    size: random.randint(10, 30),
  })
  const antagonistFlag = ui.text.flag(antagonistEmpire)
  // Defenders get some significant defense.
  const structure = gameObjectsCommon.create('structure', {name: 'city'})
  // Modify the defense of the brawn-aura to 2.
  const brawnAura = _.find(gameObjectsCommon.effects.get(structure), (effect) => effect.name === 'brawn-aura')
  // All cities should have a brawnAura, breaking here is good if that changes.
  brawnAura.magnitude = 2

  // Engage the 2 groups in battle.

  out.t('A city belonging to {{empire}} looms before you.', {empire: ui.text.naming.short(antagonistEmpire)})
  out.t('There are many defenders resisting your siege.')
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
    },
    structures: [structure],
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

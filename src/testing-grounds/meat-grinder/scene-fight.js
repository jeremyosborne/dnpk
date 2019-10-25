import {battle} from 'battle'
import * as dataSourceGame from 'data-source-game'
import * as gameObjects from 'game-objects'
import * as gameObjectsCommon from 'game-objects-common'
import hitReturnToContinue from 'hit-return-to-continue'
import _ from 'lodash'
import out from 'out'
import * as simulation from 'simulation'
import * as ui from 'ui'

//
// Run one fight from beginning to end.
//
export const sceneFight = async () => {
  // Protection against protagonist not existing should happen before we enter.
  const protagonist = dataSourceGame.protagonist.get()
  const protagonistEmpire = protagonist.empire
  let protagonistArmyGroup = protagonist.armyGroups[0]
  const protagonistFlag = ui.text.empire.flag.string({empire: protagonistEmpire})

  const antagonistEmpire = simulation.createRandom({
    exclude: {
      [protagonist.empire.name]: true,
    },
    type: 'empire',
  })
  // We want the protagonist to, in general, win the battle but lose the war.
  const antagonistArmyGroup = simulation.createRandomWeightedArmyGroup({
    size: Math.ceil(gameObjectsCommon.armies.size(protagonistArmyGroup) / 2)
  })
  const antagonistFlag = ui.text.empire.flag.string({empire: antagonistEmpire})

  const terrain = simulation.createRandom({
    exclude: {
      mountain: true,
      water: true,
    },
    type: 'terrain',
  })

  // Engage the 2 groups in battle.

  out.t('Carrying your {{flag}}, your troops venture forth onto {{terrain, commonName}},', {
    terrain,
    flag: protagonistFlag,
  })
  out.t('your troops being ({{armyGroup, commonName}})', {armyGroup: protagonistArmyGroup})
  out.t('The opposing forces of {{empire, commonName}} fly {{flag}} in the distance,', {
    empire: antagonistEmpire,
    flag: antagonistFlag,
  })
  out.t('their troops being ({{armyGroup, commonName}}).', {armyGroup: antagonistArmyGroup})

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
    _.forEach(equipment, (equippable) => dataSourceGame.equipmentVault.add(equippable))
    out.t('{{equipment, commonName}} shimmer away and teleport to the equipment vault.', {equipment})
  }

  if (gameObjectsCommon.armies.size(protagonistArmyGroup)) {
    out.t('Your ({{armyGroup, commonName}}) scavenge supplies and march on.', {armyGroup: protagonistArmyGroup})
  } else {
    out.t('You have been defeated.')
  }

  // record kills and deaths.
  _.forEach(attackers.casualties, (dead) => {
    dataSourceGame.deadCounter.add(dead.name)
  })
  _.forEach(defenders.casualties, (killed) => {
    dataSourceGame.killCounter.add(killed.name)
  })

  // Save the updated results.
  protagonistArmyGroup = gameObjects.armyGroup.sort(protagonistArmyGroup)
  dataSourceGame.protagonist.set({armyGroups: [protagonistArmyGroup]})

  // Write everything at once.
  await dataSourceGame.write()

  out('\n\n')

  await hitReturnToContinue()
}

export default sceneFight
import {battle} from 'battle'
import * as dataSourceGame from 'data-source-game'
import * as gameObjects from 'game-objects'
import hitReturnToContinue from 'hit-return-to-continue'
import _ from 'lodash'
import out from 'out'
import * as simulation from 'simulation'
import * as ui from 'ui'

export const kill = ({
  armyGroup = [],
  casualties = [],
}) => {
  const casualtyMap = _.reduce(casualties, (cm, a) => {
    cm[a.id] = true
    return cm
  }, {})
  // TODO: unattach and return any equipment that the dead carried.
  // const equipment = ....
  let updatedArmyGroup = _.reduce(armyGroup, (uag, a) => {
    if (!casualtyMap[a.id]) {
      uag.push(a)
    }
    return uag
  }, gameObjects.armyGroup.create())
  // Probably no-change if previous army-group was sorted, but do it anyway.
  updatedArmyGroup = gameObjects.armyGroup.sort(updatedArmyGroup)
  return {
    armyGroup: updatedArmyGroup,
    // TODO: return equipment from fallen heroes
    // equipment,
  }
}

export const fight = async () => {
  // Protection against protagonist not existing should happen before we enter.
  const protagonist = dataSourceGame.protagonist.get()
  const protagonistEmpire = protagonist.empire
  const protagonistArmyGroup = protagonist.armyGroups[0]

  const antagonistEmpire = simulation.createRandom({
    exclude: {
      [protagonist.empire.name]: true,
    },
    type: 'empire',
  })
  // We want the protagonist to, in general, win the battle but lose the war.
  const antagonistArmyGroup = simulation.createRandomWeightedArmyGroup({
    size: Math.ceil(protagonistArmyGroup.length / 2)
  })
  const terrain = simulation.createRandom({
    exclude: {
      mountain: true,
      water: true,
    },
    type: 'terrain',
  })

  // Engage the 2 groups in battle.

  out('')
  out.t('Carrying your {{flag}}, your troops march onward: {{armyGroup, commonName}}', {
    armyGroup: protagonistArmyGroup,
    flag: ui.text.empire.flag.string({empire: protagonistEmpire}),
  })
  out.t('They venture forth into {{terrain, commonName}}.', {terrain})
  out.t('The {{flag}} of {{empire, commonName}} flies in the distance.', {
    empire: antagonistEmpire,
    flag: ui.text.empire.flag.string({empire: antagonistEmpire}),
  })
  out.t('You can make out the opposing group: {{armyGroup, commonName}}', {armyGroup: antagonistArmyGroup})
  out.t('Both forces charge into battle!')

  await hitReturnToContinue('Hit return to see the battle results.')

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

  out('\n\n')

  // TODO: this needs a facelift for this "idle-adventure mode"
  ui.text.battle.results({attackers, defenders})

  const {armyGroup: protagonistArmyGroupUpdated} = kill({
    armyGroup: protagonistArmyGroup,
    casualties: attackers.casualties,
  })

  out.t('A moment of silence for your fallen: {{armyGroup, commonName}}', {armyGroup: attackers.casualties})
  out.t('Surveying your remaining troops ({{armyGroup, commonName}}), you scavenge supplies and march on.', {armyGroup: protagonistArmyGroupUpdated})

  out('\n\n')

  await hitReturnToContinue()
}

export default fight

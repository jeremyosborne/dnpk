import {battle} from 'battle'
import * as dataSourceGame from 'data-source-game'
import * as gameObjects from 'game-objects'
import hitReturnToContinue from 'hit-return-to-continue'
import out from 'out'
import * as ui from 'ui'

export const fight = async () => {
  // Protection against protagonist not existing should happen before we enter.
  const protagonist = dataSourceGame.protagonist.get()
  const protagonistEmpire = protagonist.empire
  const protagonistArmyGroup = protagonist.armyGroups[0]

  const antagonistEmpire = gameObjects.empire.create.random({
    exclude: {
      [protagonist.empire.name]: true,
    }
  })
  // TODO: size relative to the protagonist army-group size and strength.
  const antagonistArmyGroup = gameObjects.armyGroup.sort(
    gameObjects.armyGroup.create.random.weighted({size: 4})
  )
  const terrain = gameObjects.terrain.create.random()

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

  out('\n\n')

  await hitReturnToContinue()
}

export default fight

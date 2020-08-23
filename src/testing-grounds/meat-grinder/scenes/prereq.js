import * as gameRules from 'game-rules'
import * as gameObjectsCommon from 'game-objects-common'
import _ from 'lodash'
import * as dataSourceGame from 'meat-grinder/data-source-game'
import out from 'out'
import * as sceneChoices from './scene-choices'
import * as wrappers from './wrappers'

/**
 * This is assumed to be the first scene run, and other than things considered
 * game-preventing (like creating a protagonist), should allow the player
 * to ready themselves for the upcoming adventure.
 *
 * @return {NextScene}
 */
export const scene = async ({protagonist: {armyGroup}}) => {
  // Set the game rules, or barf a warning.
  const {gameRulesName} = dataSourceGame.settings.get()
  if (gameRulesName) {
    if (_.includes(gameRules.dir(), gameRulesName)) {
      gameRules.nameDefault(gameRulesName)
      out.t('Using game rules from settings: {{name}}', {name: gameRulesName})
    } else {
      out.t('Unsupported game rules: {{name}}.', {name: gameRulesName})
      out.t('Using default game rules: {{name}}', {name: gameRules.nameDefault()})
    }
  } else {
    out.t('Using default game rules: {{name}}', {name: gameRules.nameDefault()})
  }

  if (!gameObjectsCommon.armies.size(armyGroup)) {
    // Give the protagonist a fresh army-group if they don't have one...
    return sceneChoices.defeat()
  } else {
    // ...or else it's off to battle for you.
    return sceneChoices.violent()
  }
}

export default _.flow([
  wrappers.throwIfNoEmpire,
])(scene)

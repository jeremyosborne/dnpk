import * as gameObjects from "game-objects"
import * as gameObjectsCommon from "game-objects-common"
import * as gameRules from "game-rules"
import _ from "lodash"
import * as random from "random"
import { createScene } from "./recruit-common"
import * as simulation from "simulation"

export const createArmies = ({ armyGroup }) => {
  let armies = []
  const messages = {
    prelude: "",
  }
  const heroes = _.filter(gameObjectsCommon.armies.get(armyGroup), (army) =>
    gameObjectsCommon.effects.hasName(army, "hero")
  )

  const canHazHero =
    heroes.length === 0
      ? true
      : heroes.length < gameRules.get("heroesMax")
      ? random.randint(1, heroes.length * 2) === 1
      : false

  if (canHazHero) {
    const size = 1
    const exclude = _.filter(gameObjects.army.def(), (aDef) => {
      if (!gameObjectsCommon.effects.hasName(aDef, "hero")) {
        return true
      } else {
        return false
      }
    }).map((aDef) => aDef.name)
    armies = simulation.createRandomWeightedArmyGroup({ exclude, size }).armies
    // Use the default message.
  }

  return {
    armies,
    messages,
  }
}

/**
 * You will potentially be granted a new hero, based on the number of heroes
 * you already have.
 */
export const scene = createScene({ createArmies })

export default scene

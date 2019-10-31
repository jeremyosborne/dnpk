import * as random from 'random'
import * as sceneNames from './scene-names'

/**
 * Call when the protagonist has been defeated and it's time to resupply.
 *
 * @return {function} that returns a valid scene name when called
 */
export const defeat = () => () => {
  return sceneNames.RAISE_NEW_ARMY_GROUP
}

/**
 * After a battle, send protagonist to a scene designated as an intermission.
 *
 * At the time of writing, there is one intermission, but this allows for most
 * scenes to resort to provide sceneChoices[funcName] vs. some importing sceneNames
 * and some importing these functions.
 *
 * @return {function} that returns a valid scene name when called
 */
export const intermission = () => () => {
  return sceneNames.INTERMISSION
}

/**
 * Choose a general encounter from a weighted set of potential encounters.
 *
 * This is assumed to be called in most situations.
 *
 * @return {function} that returns a valid scene name when called
 */
export const generalEncounter = () => () => {
  // If you have an army coming into the intermission, you have a slight chance
  // for an alternate, non-fight route.
  return random.sampleWeighted({
    choices: [
      sceneNames.FIGHT,
      sceneNames.SHRINE,
    ],
    weight: (name) => {
      const weights = {
        [sceneNames.FIGHT]: 7,
        [sceneNames.SHRINE]: 1,
      }
      return weights[name] || 1
    }
  })[0]
}

/**
 * Choose a violent next-scene.
 *
 * @return {function} that returns a valid scene name when called
 */
export const violent = () => () => {
  return sceneNames.FIGHT
}

import _ from 'lodash'
import * as random from 'random'
import * as sceneNames from './scene-names'

/**
 * Call when the protagonist has been defeated and it's time to resupply.
 *
 * @return {function} that returns a valid scene name when called
 */
export const defeat = () => () => {
  return sceneNames.RECRUIT_NEW_ARMY_GROUP
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
 * This is assumed to be called in most situations and should provide the
 * "normal" outcome for a next-scene, sometimes violent, sometimes not.
 *
 * @return {function} that returns a valid scene name when called
 */
export const generalEncounter = () => () => {
  const weightedChoices = {
    [sceneNames.ARTIFACT_SITE]: 1,

    // Keep violence to ~50% of the potential choices by weight.
    // see: violent()
    [sceneNames.FIGHT]: 9,
    [sceneNames.FIGHT_CITY_SIEGE]: 1,
    [sceneNames.FIGHT_FALLEN_HERO]: 1,
    [sceneNames.FIGHT_HORDE]: 3,

    [sceneNames.RECRUIT_ARMIES]: 4,
    [sceneNames.RECRUIT_ARMIES_AERIAL]: 1,
    [sceneNames.RECRUIT_ARMIES_ELITE]: 1,
    [sceneNames.RECRUIT_HERO]: 1,
    [sceneNames.SHRINE]: 1,
    [sceneNames.VAULT_EQUIPPABLES]: 2,
  }

  return random.choices(_.keys(weightedChoices), 1, _.values(weightedChoices))[0]
}

/**
 * Created to deal with equipment redistribution in a contrived follow up scene
 * after new equipment was acquired or equipment needed to change hands.
 *
 * @return {function} that returns a valid scene name when called
 */
export const vaultEquippables = () => () => {
  return sceneNames.VAULT_EQUIPPABLES
}

/**
 * Choose a violent next-scene.
 *
 * @return {function} that returns a valid scene name when called
 */
export const violent = () => () => {
  const weightedChoices = {
    // see: generalEncounter()
    [sceneNames.FIGHT]: 4,
    [sceneNames.FIGHT_CITY_SIEGE]: 1,
    [sceneNames.FIGHT_FALLEN_HERO]: 1,
    [sceneNames.FIGHT_HORDE]: 2,
  }

  return random.choices(_.keys(weightedChoices), 1, _.values(weightedChoices))[0]
}

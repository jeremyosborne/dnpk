/* @flow */

//
// Flow types used in scenes.
//

/**
 * Return type for scenes.
 *
 * Scenes are assumed to always resolve unless there are catastrophic situations,
 * and the meanings of the resolution are:
 *
 * `string` - the official name of the next scene to transition to.
 * `null` - the game is over, your journey is done.
 * `function` - must return / resolve with a `string` or `null`.
 */
export type NextScene = Promise<string|null|() => string | null>

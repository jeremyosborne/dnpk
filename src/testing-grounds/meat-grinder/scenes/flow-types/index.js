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
export const NextScene = {}
// The above is to cause esdoc to trigger on the return type, for now, until we
// bring back flow.
//
// Turned off flow types (below) because it messes with esdoc, and I'm more invested in
// esdoc at the moment than flow, even though I really like flow.
// export type NextScene = Promise<string|null|() => string | null>

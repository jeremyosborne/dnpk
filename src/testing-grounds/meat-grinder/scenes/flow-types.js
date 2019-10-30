/* @flow */

//
// Flow types used in scenes.
//

// All scenes should return something conforming to this.
export type NextScene = Promise<string|null|() => string | null>

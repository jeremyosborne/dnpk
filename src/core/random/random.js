//
// All code within the game should, except otherwise and explicitly noted, make
// use of this particular random number generator.
//
// Reasons code might not use this random number generator:
//
// - Terrain generation that runs in its own process over time.
//
// This file exists to allow game-only random functions to import from here
// without the pain of cyclical imports from `index.js`.
//

import {create} from '@trinkets/random'

// Create a fresh instance to protect ourselves from anything accidentally messing
// with the singleton instance of the module.
export const {choice, choices, random, randint, sample, seed, state} = create()

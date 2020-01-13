//
// Customize our noise generator to work with the One-RNG (to rule them all)
// in our applicaton.
//
// Assertions:
//
// - World generation in the actual game will be a one time process. This process
//   will occur at the same point-in-call-time at each version, and as such a
//   random world seed should always produce the same world.
// - I'm a total n00b at random map generation, and I assume anything I think I
//   know right now will be discovered to be naive, so no reason to do much
//   work on this until I need it.
//

import {factories} from '@trinkets/noise'
import {random} from './random'

export const perlin = factories.perlin({random})

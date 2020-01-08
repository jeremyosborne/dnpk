/*

Perlin noise.

Useful for generating numbers that can be used for generating, say, random
terrain on a map that has some credible transition from one (elevation based)
terrain type to another.

Could be used for basic terrains. Likely not the best use for applying things
like rivers, roads, tribal populations, etc.

see:

- http://mrl.nyu.edu/~perlin/doc/oscar.html (and links to info from this page)
- http://eastfarthing.com/blog/2015-04-21-noise/ (code that we copied for use)

*/

import {random as _random} from '../random'

/**
 * Create a 2d perlin noise function.
 *
 * The returned function is initialized and ready for use.
 */
export const create = ({
  // function() that, when called, returns an assumed random number between 0 and 1,
  // per the definition of Math.random. We use the seeded random number generator
  // by default.
  random = _random,
  // Jitter is useful for offsetting the zero of the surflet from integer values
  // of x,y. False to turn off jitter.
  jitter = true,
} = {}) => {
  // Size, mask, perm, gradsX, and gradsY are all related.
  // How many unit vectors will we create?
  const size = 256
  // Used to constrain the absolute values of incoming points to our vector lookup table.
  const mask = size - 1
  // Our hash lookup into of, "Which gradient vector should I use for a particular point?"
  const perm = []
  // gradsX and gradsY together form the 2d gradient vector we use, with randomized
  // lookup via `perm`.
  const gradsX = []
  const gradsY = []
  // jitX and jitY together allow us, in general, to offset the zero value of
  // an integer input {x, y}. We use this in our implementation by default as
  // default grid coordinates are integer based. Smoother noise can be added
  // by the caller.
  const jitX = []
  const jitY = []

  /**
   * Generate a set of randomized gradient vectors used in our noise calculations.
   *
   * Automatically called when creating a new function. Can be called by the
   * user to reset the tables of that particular instance of the noise function.
   */
  const init = () => {
    for (let i = 0; i < size; ++i) {
      const other = Math.floor(random() * Number.MAX_SAFE_INTEGER) % (i + 1)
      // Generate a randomized list of integers.
      // see: https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_.22inside-out.22_algorithm
      if (i > other) {
        perm[i] = perm[other]
      }
      perm[other] = i

      // All the unit vectors in a circle of `size`.
      gradsX[i] = Math.cos(2 * Math.PI * i / size)
      gradsY[i] = Math.sin(2 * Math.PI * i / size)
      // Per notes, jitter offset is a random number between 0 and 1 and is applied
      // to each gradient vector. As jitter is applied via addition, setting to
      // 0 is turning it off.
      jitX[i] = jitter ? random() : 0
      jitY[i] = jitter ? random() : 0
    }
  }

  // Return value between 1 and 0; 1 at 0, 0 at >= 1 or -1.
  // The unit vectors beyond a given point will not contribute to the result.
  const falloff = (t) => {
    t = Math.abs(t)
    return t >= 1 ? 0 : 1 - ((3 - (2 * t)) * t * t)
  }

  // Return surflet value at a point.
  // The definition of surflet from the code we stole means that without any
  // jitter, the value at an integer coord will always be 0.
  const surflet = (x, y, gradX, gradY) => {
    return falloff(x) * falloff(y) * (gradX * x + gradY * y)
  }

  // Take an {x: float, y: float} coordinate and return a float value of the
  // noise at that particular coordinate.
  // Due to jitter, this function is generally friendly to integer based {x,y}
  // coordinates.
  const perlin = (x, y) => {
    let result = 0
    const cellX = Math.floor(x)
    const cellY = Math.floor(y)
    for (let gridY = cellY; gridY <= cellY + 1; ++gridY) {
      for (let gridX = cellX; gridX <= cellX + 1; ++gridX) {
        const hash = perm[(perm[gridX & mask] + gridY) & mask]
        // Original, non-jittered:
        // result += surflet(x - gridX, y - gridY, gradsX[hash], gradsY[hash])
        // add "jitter" to make it friendlier to {x, y} being integers.
        result += surflet(x - gridX + jitX[hash], y - gridY + jitY[hash], gradsX[hash], gradsY[hash])
      }
    }
    return result
  }

  // Initialize.
  init()
  // Export "private" properties/methods for introspection and testing.
  // Meant to be accessed read-only.
  perlin._size = size
  perlin._mask = mask
  perlin._perm = perm
  perlin._gradsX = gradsX
  perlin._gradsY = gradsY
  perlin._surflet = surflet
  perlin._falloff = falloff
  // Public API.
  // Allow and encourage reininitialization if needed.
  perlin.init = init

  return perlin
}

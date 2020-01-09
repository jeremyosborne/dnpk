// Original seed used to generate the current stream of random numbers.
let seedInitial = Date.now()
let seedz = seedInitial
let seedw = seedz / 29

/**
 * Generate a random number between 0 and 1.
 *
 * The function can be seeded with one of the supporting methods, with the
 * default seed based on the date.
 *
 * @return {number} Floating point number between 0 and 1.
 */
export const random = function () {
  seedz = 36969 * (seedz & 65535) + (seedz >> 16)
  seedw = 18000 * (seedw & 65535) + (seedw >> 16)
  // The bit shifting may leave us with a signed number by the time we're done.
  // We'll force the signed integer into being an unsigned integer with the zero-fill
  // right shift (strange as this is, it seems to work, thanks to the hint from:
  // https://stackoverflow.com/a/1908655).
  // To get us back to the world of JavaScript Math.random(),
  // we divide by unsigned 32-bit int max + 1 for a number between 0 (inclusive)
  // and 1 (exclusive).
  return (((seedz << 16) + seedw) >>> 0) / 4294967295
  //
  // Afternote:
  //
  // Number types in JavaScript (according to ECMA-262):
  //
  //   primitive value corresponding to a double-precision 64-bit binary
  //   format IEEE 754 value.
  //
  // Bitshifting in JavaScript forces a number into a signed 32-bit format
  // (see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators#Signed_32-bit_integers).
  //
  // The original code started with an older version of the multiply-with-carry
  // that can now be found here: https://en.wikipedia.org/wiki/Multiply-with-carry_pseudorandom_number_generator
  //
  // Started with the wikipedia version:
  //
  // m_w = <choose-initializer>;    /* must not be zero */
  // m_z = <choose-initializer>;    /* must not be zero */
  //
  // uint get_random()
  // {
  //    m_z = 36969 * (m_z & 65535) + (m_z >> 16);
  //    m_w = 18000 * (m_w & 65535) + (m_w >> 16);
  //    return (m_z << 16) + m_w;  /* 32-bit result */
  // }
  //
  // Some not-rigorous-tests on jsperf within my Chrome browser show this code
  // to be about 20% faster than Math.random(?). The also not very rigorous monte-carlo
  // test then bucket the results testing I've been doing shows this and Math.random()
  // appear to have similar, not odd looking (says my very biased human eyes +
  // brain) distributions.
}

export const seed = {
  /**
   * Seed the pseudo-random number generator.
   *
   * @param {number} [seed=Date.now()] non-zero integer.
   *
   * @see getSeed
   */
  set: function (seed) {
    // Save for later reference.
    seedInitial = seed || Date.now()
    seedz = seed
    seedw = seedz / 29
  },

  /**
   * Return the seed value used to generate this current stream of random
   * numbers.
   *
   * @return {number} The current seed value.
   *
   * @see setSeed
   */
  get: function () {
    return seedInitial
  },
}

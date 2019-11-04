// Seed
let seedz = Date.now()
let seedw = Date.now() / 29

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
  return (Math.abs((seedz << 16) + seedw) % 65535) / 65535
  //
  // Afternote:
  //
  // Number types in JavaScript (according to ECMA-262):
  //   primitive value corresponding to a double-precision 64-bit binary
  //   format IEEE 754 value.
  // Starting with the wikipedia Random Number generator, described as
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
  // and is better described at:
  // http://www.bobwheeler.com/statistics/Password/MarsagliaPost.txt.
  //
  // My thought follows:
  // The result of this is supposed to be a 32-bit unsigned integer,
  // but i'm not sure given some results I was seeing as I messed around
  // with this in JavaScript, so I changed it.
  //
  // I'm going to mod the result with an unsigned 16bit max value
  // and then divide by that. Even the funky ECMAScript-262 Number type
  // shouldn't have any problems with this.
}

export const seed = {
  /**
   * Seed the pseudo-random number generator.
   *
   * @param {number} [sz=Date.now()] non-zero integer used as seedz.
   * @param {number} [sw=Date.now() / 29] non-zero integer used as seedw.
   *
   * @see getSeed
   */
  set: function (sz, sw) {
    seedz = sz || Date.now()
    seedw = sw || Date.now() / 29
  },

  /**
   * Return the current seed values.
   *
   * @return {{seedz: number, seedw: number}} The current seed values.
   *
   * @see setSeed
   */
  get: function () {
    return {seedz, seedw}
  },
}

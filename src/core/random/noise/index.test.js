import * as testMod from './'

describe('random.noise', () => {
  describe('perlin', () => {
    it("doesn't blow up", () => {
      const value = testMod.perlin(0, 0)
      // More extensive tests are performed in the perlin module, this just checks
      // that things work.
      expect(typeof value).toEqual('number')
    })
  })
})

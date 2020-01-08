import * as testMod from './perlin'

describe('random.noise.perlin', () => {
  describe('create', () => {
    it('returns a function', () => {
      const p = testMod.create()
      const value = p(1, 1)
      expect(typeof value).toEqual('number')
      expect(Number.isNaN(value)).toEqual(false)
    })
    it('has configurable jitter', () => {
      const p = testMod.create({jitter: false})
      const value = p(1, 1)
      // With no jitter, calculations at integer points will always have 0 noise.
      expect(value).toEqual(0)
    })
  })
})

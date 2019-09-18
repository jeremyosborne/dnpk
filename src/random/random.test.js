import * as testMod from './random'

describe('random.random', () => {
  it('returns expected random values', () => {
    // Assume multiple calls and tests over time will eventually find problems.
    const val = testMod.random()
    expect(val >= 0).toEqual(true)
    expect(val <= 1).toEqual(true)
  })

  describe('seed', () => {
    it('can get and set', () => {
      testMod.seed.set(5, 5)
      // Calling random will change the seed.
      expect(testMod.seed.get()).toEqual({seedz: 5, seedw: 5})
    })
  })
})

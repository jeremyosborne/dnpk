import * as testMod from './random'

describe('random', () => {
  describe('random()', () => {
    it('returns expected random values', () => {
      // Assume multiple calls and tests over time will eventually find problems.
      const val = testMod.random()
      expect(val >= 0).toEqual(true)
      expect(val < 1).toEqual(true)
    })
  })

  describe('seed', () => {
    it('can get and set', () => {
      testMod.seed.set(5)
      // Calling random will change the seed.
      expect(testMod.seed.get()).toEqual(5)
    })

    it('seeds to now when called without args', () => {
      testMod.seed.set()
      const seed = testMod.seed.get()
      expect(typeof seed).toEqual('number')
    })
  })

  describe('state', () => {
    it('allows resetting of state', () => {
      testMod.seed.set(123)
      // run off a couple
      testMod.random()
      testMod.random()
      const state = testMod.state.get()
      const vals1 = []
      for (let i = 0; i < 10; i++) {
        vals1.push(testMod.random())
      }
      // reset
      testMod.state.set(state)
      const vals2 = []
      for (let i = 0; i < 10; i++) {
        vals2.push(testMod.random())
      }
      expect(vals1).toEqual(vals2)
    })
  })
})

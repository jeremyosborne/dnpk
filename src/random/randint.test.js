import {seed} from './random'
import randint from './randint'

describe('randint', () => {
  it('returns expected random values', () => {
    // Assume multiple calls and tests over time will eventually find problems.
    const val = randint(-10, 10)
    expect(val >= -10).toEqual(true)
    expect(val <= 10).toEqual(true)
    expect(val === Math.floor(val)).toEqual(true)
  })

  it("doesn't barf on zero", () => {
    const val = randint(0, 10)
    expect(val >= 0).toEqual(true)
    expect(val <= 10).toEqual(true)
    expect(val === Math.floor(val)).toEqual(true)
  })

  it('errors as expected', () => {
    expect(() => randint(10, 1)).toThrow()
    expect(() => randint()).toThrow()
  })

  describe('seed', () => {
    it('produces the same values when seeded', () => {
      seed.set(5, 5)
      // Values from the REPL, assume this will work across systems.
      expect(randint(1, 10)).toEqual(8)
      expect(randint(1, 10)).toEqual(8)
      expect(randint(1, 10)).toEqual(9)
      expect(randint(1, 10)).toEqual(10)
      expect(randint(1, 10)).toEqual(8)
      expect(randint(1, 10)).toEqual(6)
      expect(randint(1, 10)).toEqual(3n)
    })
  })
})

const randint = require('./randint')

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
})

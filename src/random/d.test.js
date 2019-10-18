import * as dataSourceModdables from 'data-source-moddables'
import d from './d'

describe('random.d', () => {
  it('returns expected random values', () => {
    // Assume multiple calls and tests over time will eventually find problems.
    const val = d(10)
    expect(val >= 1).toEqual(true)
    expect(val <= 10).toEqual(true)
    expect(val === Math.floor(val)).toEqual(true)
  })

  describe('.standard()', () => {
    beforeEach(async () => {
      // Need game rules to test this.
      await dataSourceModdables.read()
    })
    it('works', async () => {
      const val = d.standard()
      expect(val >= 0).toEqual(true)
      expect(val <= 10).toEqual(true)
      expect(val === Math.floor(val)).toEqual(true)
    })
  })
})

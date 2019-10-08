import * as dataSourceGameObjects from 'data-source-game-objects'
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
      await dataSourceGameObjects.read()
    })
    it('works', async () => {
      const val = d.standard()
      expect(val >= 0).toEqual(true)
      expect(val <= 10).toEqual(true)
      expect(val === Math.floor(val)).toEqual(true)
    })
  })
})

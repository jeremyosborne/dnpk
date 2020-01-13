import * as dataSourceModdables from 'data-source-moddables'
import * as dice from './'

describe('dice', () => {
  describe('.standard()', () => {
    beforeEach(async () => {
      // Need game rules to test this.
      await dataSourceModdables.read()
    })

    it('works', async () => {
      const val = dice.standard()
      expect(val >= 0).toEqual(true)
      expect(val <= 10).toEqual(true)
      expect(val === Math.floor(val)).toEqual(true)
    })
  })
})

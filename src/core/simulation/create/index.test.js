import * as testMod from './'
import * as dataSourceModdables from 'data-source-moddables'

// Assume we'll always have this distinct name...
const TEST_NAME_VALID = 'hero'
// ...and never this one.
const TEST_NAME_INVALID = 'fake'

describe('simulation.create', () => {
  describe('.army()', () => {
    beforeEach(async () => {
      // load dependencies...
      await dataSourceModdables.read()
    })

    it('works', () => {
      const instance = testMod.army({name: TEST_NAME_VALID})
      expect(typeof instance.id).toEqual('string')
      expect(instance.name).toEqual(TEST_NAME_VALID)
      expect(instance.type).toEqual('army')
    })

    it('breaks on bad name', () => {
      expect(() => testMod.army({name: TEST_NAME_INVALID})).toThrow()
    })

    it("it breaks if things aren't loaded", () => {
      dataSourceModdables.clear()
      expect(() => testMod.random()).toThrow()
    })
  })
})

import * as testMod from './'
import _ from 'lodash'
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

    it('give naming-proper to heroes', () => {
      const instance = testMod.army({name: 'hero'})
      expect(!!_.find(instance.cosmetics, (cosmetic) => cosmetic.name === 'naming-proper')).toEqual(true)
    })

    it('give flavor to regular troops', () => {
      const instance = testMod.army({name: 'light-infantry'})
      expect(!!_.find(instance.cosmetics, (cosmetic) => cosmetic.name === 'naming-flavor')).toEqual(true)
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

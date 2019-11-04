import * as testMod from './'
import * as dataSourceModdables from 'data-source-moddables'

// Assume we'll always have this distinct type...
const TEST_NAME_VALID = 'classic'
// ...and never this one.
// const TEST_NAME_INVALID = 'fake'

describe('game-rules.get', () => {
  beforeEach(async () => {
    // load dependencies...
    await dataSourceModdables.read()
  })

  describe('.get()', () => {
    it('returns a value for an expected rule', () => {
      // Default rule set should carry it's own `name`.
      expect(testMod.get('name')).toEqual(TEST_NAME_VALID)
      // Explicit rule set
      expect(testMod.get(TEST_NAME_VALID, 'name')).toEqual(TEST_NAME_VALID)
    })
  })
})

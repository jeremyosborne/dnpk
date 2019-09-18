import * as testMod from './'
import * as configGameObjects from 'config-game-objects'

// Assume we'll always have this distinct type...
const TEST_TYPE_VALID = 'classic'
// ...and never this one.
// const TEST_TYPE_INVALID = 'fake'

describe('game-objects.rules.get', () => {
  beforeEach(async () => {
    // load dependencies...
    await configGameObjects.load()
  })

  describe('.get()', () => {
    it('returns a value for an expected rule', () => {
      // Default rule set should carry it's own `name`.
      expect(testMod.get('name')).toEqual(TEST_TYPE_VALID)
      // Explicit rule set
      expect(testMod.get(TEST_TYPE_VALID, 'name')).toEqual(TEST_TYPE_VALID)
    })
  })
})

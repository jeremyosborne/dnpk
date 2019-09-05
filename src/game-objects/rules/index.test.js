import * as rules from './'
import * as configGameObjects from 'config-game-objects'

// Assume we'll always have this distinct type...
const TEST_TYPE_VALID = 'classic'
// ...and never this one.
// const TEST_TYPE_INVALID = 'fake'

describe('rules', () => {
  beforeEach(async () => {
    // load dependencies...
    await configGameObjects.load()
  })

  describe('.dir()', () => {
    it('works', () => {
      expect(rules.dir().length > 0).toEqual(true)
    })
  })

  describe('.get()', () => {
    it('returns a value for an expected rule', () => {
      // Default rule set should carry it's own `name`.
      expect(rules.get('name')).toEqual(TEST_TYPE_VALID)
      // Explicit rule set
      expect(rules.get(TEST_TYPE_VALID, 'name')).toEqual(TEST_TYPE_VALID)
    })
  })

  describe('.nameDefault()', () => {
    it('returns expected default value', () => {
      expect(rules.nameDefault()).toEqual(TEST_TYPE_VALID)
    })
  })
})

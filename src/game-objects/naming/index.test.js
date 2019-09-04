import * as naming from './'
import * as configGameObjects from 'config-game-objects'

// Assume we'll always have this distinct type...
const TEST_TYPE_VALID = 'hero'
// ...and never this one.
const TEST_TYPE_INVALID = 'fake'

describe('naming', () => {
  beforeEach(async () => {
    // load dependencies...
    await configGameObjects.load()
  })

  describe('.dir()', () => {
    it('works', () => {
      expect(naming.dir().length > 0).toEqual(true)
    })
  })

  describe('.create()', () => {
    it('works', () => {
      const instance = naming.create({name: TEST_TYPE_VALID})
      expect(typeof instance === 'string').toEqual(true)
    })

    it('breaks on bad name', () => {
      expect(() => naming.create({name: TEST_TYPE_INVALID})).toThrow()
    })
  })
})

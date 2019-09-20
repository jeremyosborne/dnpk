import * as testMod from './'
import * as configGameObjects from 'config-game-objects'

// Assume we'll always have this distinct type...
const TEST_TYPE_VALID = 'hero'
// ...and never this one.
const TEST_TYPE_INVALID = 'fake'

describe('game-objects.effect.create', () => {
  beforeEach(async () => {
    // load dependencies...
    await configGameObjects.load()
  })

  it('works', () => {
    const instance = testMod.create({name: TEST_TYPE_VALID})
    expect(typeof instance.id === 'string').toEqual(true)
    expect(instance.type).toEqual('effect')
  })

  it('breaks on bad name', () => {
    expect(() => testMod.create({name: TEST_TYPE_INVALID})).toThrow()
  })

  describe('.random()', () => {
    it('works', () => {
      expect(testMod.create.random().type).toEqual('effect')
    })

    it("it breaks if things aren't loaded", () => {
      configGameObjects.clear()
      expect(() => testMod.create.random()).toThrow()
    })
  })
})

import * as testMod from './'
import * as dataSourceGameObjects from 'data-source-game-objects'

// Assume we'll always have this distinct type...
const TEST_TYPE_VALID = 'light-infantry'
// ...and never this one.
const TEST_TYPE_INVALID = 'fake'

describe('game-objects.army.create', () => {
  beforeEach(async () => {
    // load dependencies...
    await dataSourceGameObjects.read()
  })

  it('works', () => {
    const instance = testMod.create({name: TEST_TYPE_VALID})
    expect(typeof instance.id === 'string').toEqual(true)
    expect(instance.type).toEqual('army')
  })

  it('throws on bad name', () => {
    expect(() => testMod.create({name: TEST_TYPE_INVALID})).toThrow()
  })

  describe('.random()', () => {
    it('works', () => {
      // No array by default.
      expect(testMod.create.random().type).toEqual('army')
      // As array if size > 1.
      expect(testMod.create.random({size: 2}).length).toEqual(2)
    })

    it("it throws if things aren't loaded", () => {
      dataSourceGameObjects.clear()
      expect(() => testMod.create.random()).toThrow()
    })

    it('it throws if size < 1', () => {
      expect(() => testMod.create.random({size: 0})).toThrow()
    })
  })

  describe('.random.weighted()', () => {
    it('works', () => {
      // No array by default.
      expect(testMod.create.random.weighted().type).toEqual('army')
      // As array if size > 1.
      expect(testMod.create.random.weighted({size: 2}).length).toEqual(2)
    })

    it("it throws if things aren't loaded", () => {
      dataSourceGameObjects.clear()
      expect(() => testMod.create.random.weighted()).toThrow()
    })

    it('it throws if size < 1', () => {
      expect(() => testMod.create.random.weighted({size: 0})).toThrow()
    })
  })
})

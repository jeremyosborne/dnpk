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

  it('breaks on bad name', () => {
    expect(() => testMod.create({name: TEST_TYPE_INVALID})).toThrow()
  })

  describe('.random()', () => {
    it('works', () => {
      expect(testMod.create.random().type).toEqual('army')
    })

    it("it breaks if things aren't loaded", () => {
      dataSourceGameObjects.clear()
      expect(() => testMod.create.random()).toThrow()
    })
  })

  describe('.random.weighted()', () => {
    it('works', () => {
      expect(testMod.create.random.weighted().type).toEqual('army')
    })

    it("it breaks if things aren't loaded", () => {
      dataSourceGameObjects.clear()
      expect(() => testMod.create.random.weighted()).toThrow()
    })
  })

  describe('.sampleWeighted()', () => {
    it('works', () => {
      expect(testMod.sampleWeighted().length > 0).toEqual(true)
      expect(testMod.sampleWeighted()[0].type).toEqual('army')
    })

    it("it breaks if things aren't loaded", () => {
      dataSourceGameObjects.clear()
      expect(() => testMod.sampleWeighted()).toThrow()
    })
  })
})

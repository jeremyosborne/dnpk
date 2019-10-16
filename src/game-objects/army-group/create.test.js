import * as testMod from './'
import * as dataSourceGameObjects from 'data-source-game-objects'

describe('game-objects.armyGroup.create', () => {
  beforeEach(async () => {
    // load dependencies...
    await dataSourceGameObjects.read()
  })

  it('works', () => {
    const instance = testMod.create()
    expect(Array.isArray(instance)).toEqual(true)
  })

  describe('.random()', () => {
    it('works', () => {
      expect(testMod.create.random().length).toEqual(8)
      expect(testMod.create.random()[0].type).toEqual('army')

      // It also works with size and returns an array if size === 1
      expect(testMod.create.random({size: 1}).length).toEqual(1)
    })

    it("it breaks if things aren't loaded", () => {
      dataSourceGameObjects.clear()
      expect(() => testMod.create.random()).toThrow()
    })
  })

  describe('.random.weighted()', () => {
    it('works', () => {
      expect(testMod.create.random.weighted().length).toEqual(8)
      expect(testMod.create.random.weighted()[0].type).toEqual('army')

      // It also works with size and returns an array if size === 1
      expect(testMod.create.random.weighted({size: 1}).length).toEqual(1)
    })

    it("it breaks if things aren't loaded", () => {
      dataSourceGameObjects.clear()
      expect(() => testMod.create.random.weighted()).toThrow()
    })
  })
})

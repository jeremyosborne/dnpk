import * as dataSourceModdables from 'data-source-moddables'
import testMod from './'

describe('game-objects-common.effects', () => {
  const effect1 = {name: 'random', id: 'effect1'}
  const effect2 = {name: 'blah', id: 'effect2'}

  it('works with arrays', () => {
    const effects = []
    expect(testMod.has(effects, effect1)).toEqual(false)
    expect(testMod.hasName(effects, 'random')).toEqual(false)
    testMod.add(effects, effect1)
    testMod.add(effects, effect1)
    expect(effects.length).toEqual(1)
    expect(effects[0].id).toEqual(effect1.id)
    testMod.add(effects, effect2)
    expect(testMod.has(effects, effect1)).toEqual(true)
    expect(testMod.has(effects, effect2)).toEqual(true)
    expect(testMod.hasName(effects, 'random')).toEqual(true)
    expect(testMod.hasName(effects, 'blah')).toEqual(true)
    const removed = testMod.remove(effects, effect1)
    expect(effects.length).toEqual(1)
    expect(removed.id).toEqual(effect1.id)
    expect(testMod.has(effects, effect1)).toEqual(false)
    expect(testMod.has(effects, effect2)).toEqual(true)
    expect(!!testMod.remove(effects, effect1)).toEqual(false)
  })

  it('works with things that implement effects', () => {
    const army = {
      effects: [],
    }
    expect(testMod.has(army, effect1)).toEqual(false)
    expect(testMod.hasName(army, 'random')).toEqual(false)
    testMod.add(army, effect1)
    testMod.add(army, effect1)
    expect(testMod.has(army, effect1)).toEqual(true)
    expect(testMod.hasName(army, 'random')).toEqual(true)
    expect(army.effects.length).toEqual(1)
    expect(army.effects[0].id).toEqual(effect1.id)
    expect(testMod.has(army, effect1)).toEqual(true)
    testMod.add(army, effect2)
    expect(testMod.hasName(army, 'random')).toEqual(true)
    expect(testMod.hasName(army, 'blah')).toEqual(true)
    const removed = testMod.remove(army, effect1)
    expect(army.effects.length).toEqual(1)
    expect(removed.id).toEqual(effect1.id)
    expect(testMod.has(army, effect1)).toEqual(false)
    expect(testMod.has(army, effect2)).toEqual(true)
    expect(!!testMod.remove(army, effect1)).toEqual(false)
  })

  describe('size', () => {
    it('works', () => {
      expect(testMod.size()).toEqual(0)
      expect(testMod.size([1, 2, 3])).toEqual(3)
      expect(testMod.size({
        effects: ['a', 3, 6]
      })).toEqual(3)
    })
  })

  describe('blessings', () => {
    beforeEach(async () => {
      // blessings performs an object creation that refers to existing objects.
      await dataSourceModdables.read()
    })

    const deityName = 'spaghetti monster'
    const imposterName = 'not the spaghetti monster'
    const blessing = {name: 'brawn', magnitude: 1, metadata: {comesFrom: deityName}}
    const army = {effects: [blessing]}

    describe('has', () => {
      it('works', () => {
        expect(testMod.blessings.has(army, deityName)).toEqual(true)
        expect(testMod.blessings.has(army, imposterName)).toEqual(false)
      })
    })

    describe('add', () => {
      it('works', () => {
        // No duplicating of blessings.
        expect(army.effects.length).toEqual(1)
        testMod.blessings.add(army, deityName)
        expect(army.effects.length).toEqual(1)
        testMod.blessings.add(army, imposterName)
        expect(army.effects.length).toEqual(2)
        expect(testMod.blessings.has(army, imposterName)).toEqual(true)
      })
    })
  })
})

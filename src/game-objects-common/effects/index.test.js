import * as testMod from './'

describe('game-objects-common.effects', () => {
  const effect1 = {id: 'effect1'}

  it('works with arrays', () => {
    const effects = []
    testMod.add(effects, effect1)
    testMod.add(effects, effect1)
    expect(effects.length).toEqual(1)
    expect(effects[0].id).toEqual(effect1.id)
    expect(testMod.has(effects, effect1)).toEqual(true)
    const removed = testMod.remove(effects, effect1)
    expect(effects.length).toEqual(0)
    expect(removed.id).toEqual(effect1.id)
    expect(testMod.has(effects, effect1)).toEqual(false)
    expect(!!testMod.remove(effects, effect1)).toEqual(false)
  })

  it('works with things that implement effects', () => {
    const army = {
      effects: [],
    }
    testMod.add(army, effect1)
    testMod.add(army, effect1)
    expect(army.effects.length).toEqual(1)
    expect(army.effects[0].id).toEqual(effect1.id)
    expect(testMod.has(army, effect1)).toEqual(true)
    const removed = testMod.remove(army, effect1)
    expect(army.effects.length).toEqual(0)
    expect(removed.id).toEqual(effect1.id)
    expect(testMod.has(army, effect1)).toEqual(false)
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
})

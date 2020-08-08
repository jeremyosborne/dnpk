import testMod from './'

describe('game-objects-common.cosmetics', () => {
  const cosmetic1 = {name: 'random', id: 'effect1', value: 'value1'}
  const cosmetic2 = {name: 'blah', id: 'effect2', value: 'value1'}

  it('works with arrays', () => {
    const cosmetics = []
    expect(testMod.has(cosmetics, cosmetic1)).toEqual(false)
    expect(testMod.hasName(cosmetics, 'random')).toEqual(false)
    testMod.add(cosmetics, cosmetic1)
    testMod.add(cosmetics, cosmetic1)
    expect(cosmetics.length).toEqual(1)
    expect(cosmetics[0].id).toEqual(cosmetic1.id)
    testMod.add(cosmetics, cosmetic2)
    expect(testMod.has(cosmetics, cosmetic1)).toEqual(true)
    expect(testMod.has(cosmetics, cosmetic2)).toEqual(true)
    expect(testMod.hasName(cosmetics, 'random')).toEqual(true)
    expect(testMod.hasName(cosmetics, 'blah')).toEqual(true)
    const removed = testMod.remove(cosmetics, cosmetic1)
    expect(cosmetics.length).toEqual(1)
    expect(removed.id).toEqual(cosmetic1.id)
    expect(testMod.has(cosmetics, cosmetic1)).toEqual(false)
    expect(testMod.has(cosmetics, cosmetic2)).toEqual(true)
    expect(!!testMod.remove(cosmetics, cosmetic1)).toEqual(false)
  })

  it('works with things that implement cosmetics', () => {
    const army = {
      cosmetics: [],
    }
    expect(testMod.has(army, cosmetic1)).toEqual(false)
    expect(testMod.hasName(army, 'random')).toEqual(false)
    testMod.add(army, cosmetic1)
    testMod.add(army, cosmetic1)
    expect(testMod.has(army, cosmetic1)).toEqual(true)
    expect(testMod.hasName(army, 'random')).toEqual(true)
    expect(army.cosmetics.length).toEqual(1)
    expect(army.cosmetics[0].id).toEqual(cosmetic1.id)
    expect(testMod.has(army, cosmetic1)).toEqual(true)
    testMod.add(army, cosmetic2)
    expect(testMod.hasName(army, 'random')).toEqual(true)
    expect(testMod.hasName(army, 'blah')).toEqual(true)
    const removed = testMod.remove(army, cosmetic1)
    expect(army.cosmetics.length).toEqual(1)
    expect(removed.id).toEqual(cosmetic1.id)
    expect(testMod.has(army, cosmetic1)).toEqual(false)
    expect(testMod.has(army, cosmetic2)).toEqual(true)
    expect(!!testMod.remove(army, cosmetic1)).toEqual(false)
  })

  describe('size', () => {
    it('works', () => {
      expect(testMod.size()).toEqual(0)
      expect(testMod.size([1, 2, 3])).toEqual(3)
      expect(testMod.size({
        cosmetics: ['a', 3, 6]
      })).toEqual(3)
    })
  })

  // TODO... the extended api.
})

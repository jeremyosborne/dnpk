import testMod from './'

describe('game-objects-common.deeds', () => {
  const deed1 = {name: 'battle', id: '1', value: 'Short battle'}
  const deed2 = {name: 'battle', id: '2', value: 'Longer battle'}

  it('works with arrays', () => {
    const deeds = []
    expect(testMod.has(deeds, deed1)).toEqual(false)
    expect(testMod.hasName(deeds, 'battle')).toEqual(false)
    testMod.add(deeds, deed1)
    testMod.add(deeds, deed1)
    expect(deeds.length).toEqual(1)
    expect(deeds[0].id).toEqual(deed1.id)
    testMod.add(deeds, deed2)
    expect(testMod.has(deeds, deed1)).toEqual(true)
    expect(testMod.has(deeds, deed2)).toEqual(true)
    expect(testMod.hasName(deeds, 'battle')).toEqual(true)
    expect(testMod.hasName(deeds, 'battle')).toEqual(true)
    const removed = testMod.remove(deeds, deed1)
    expect(deeds.length).toEqual(1)
    expect(removed.id).toEqual(deed1.id)
    expect(testMod.has(deeds, deed1)).toEqual(false)
    expect(testMod.has(deeds, deed2)).toEqual(true)
    expect(!!testMod.remove(deeds, deed1)).toEqual(false)
  })

  it('works with things that implement it', () => {
    const army = {
      deeds: [],
    }
    expect(testMod.has(army, deed1)).toEqual(false)
    expect(testMod.hasName(army, 'battle')).toEqual(false)
    testMod.add(army, deed1)
    testMod.add(army, deed1)
    expect(testMod.has(army, deed1)).toEqual(true)
    expect(testMod.hasName(army, 'battle')).toEqual(true)
    expect(army.deeds.length).toEqual(1)
    expect(army.deeds[0].id).toEqual(deed1.id)
    expect(testMod.has(army, deed1)).toEqual(true)
    testMod.add(army, deed2)
    expect(testMod.hasName(army, 'battle')).toEqual(true)
    expect(testMod.hasName(army, 'battle')).toEqual(true)
    const removed = testMod.remove(army, deed1)
    expect(army.deeds.length).toEqual(1)
    expect(removed.id).toEqual(deed1.id)
    expect(testMod.has(army, deed1)).toEqual(false)
    expect(testMod.has(army, deed2)).toEqual(true)
    expect(!!testMod.remove(army, deed1)).toEqual(false)
  })

  describe('size', () => {
    it('works', () => {
      expect(testMod.size()).toEqual(0)
      expect(testMod.size([1, 2, 3])).toEqual(3)
      expect(testMod.size({
        deeds: ['a', 3, 6]
      })).toEqual(3)
    })
  })
})

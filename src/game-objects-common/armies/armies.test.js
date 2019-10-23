import * as testMod from './'

describe('game-objects-common.armies', () => {
  const army1 = {id: 'army1'}

  it('works with arrays', () => {
    const armyGroup = []
    testMod.add(armyGroup, army1)
    testMod.add(armyGroup, army1)
    expect(armyGroup.length).toEqual(1)
    expect(armyGroup[0].id).toEqual(army1.id)
    const removed = testMod.remove(armyGroup, army1)
    expect(armyGroup.length).toEqual(0)
    expect(removed.id).toEqual(army1.id)
    expect(!!testMod.remove(armyGroup, army1)).toEqual(false)
  })

  it('works with army-groups', () => {
    const armyGroup = {
      armies: [],
    }
    testMod.add(armyGroup, army1)
    testMod.add(armyGroup, army1)
    expect(armyGroup.armies.length).toEqual(1)
    expect(armyGroup.armies[0].id).toEqual(army1.id)
    const removed = testMod.remove(armyGroup, army1)
    expect(armyGroup.armies.length).toEqual(0)
    expect(removed.id).toEqual(army1.id)
    expect(!!testMod.remove(armyGroup, army1)).toEqual(false)
  })

  describe('size', () => {
    it('works', () => {
      expect(testMod.size()).toEqual(0)
      expect(testMod.size([1, 2, 3])).toEqual(3)
      expect(testMod.size({
        armies: ['a', 3, 6]
      })).toEqual(3)
    })
  })
})

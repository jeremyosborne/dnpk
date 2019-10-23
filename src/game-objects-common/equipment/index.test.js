import * as testMod from './'

describe('game-objects-common.equipment', () => {
  const equippable1 = {id: 'equippable1'}

  it('works with arrays', () => {
    const equipment = []
    testMod.add(equipment, equippable1)
    testMod.add(equipment, equippable1)
    expect(equipment.length).toEqual(1)
    expect(equipment[0].id).toEqual(equippable1.id)
    const removed = testMod.remove(equipment, equippable1)
    expect(equipment.length).toEqual(0)
    expect(removed.id).toEqual(equippable1.id)
    expect(!!testMod.remove(equipment, equippable1)).toEqual(false)
  })

  it('works with things that implement equipment', () => {
    const army = {
      equipment: [],
    }
    testMod.add(army, equippable1)
    testMod.add(army, equippable1)
    expect(army.equipment.length).toEqual(1)
    expect(army.equipment[0].id).toEqual(equippable1.id)
    const removed = testMod.remove(army, equippable1)
    expect(army.equipment.length).toEqual(0)
    expect(removed.id).toEqual(equippable1.id)
    expect(!!testMod.remove(army, equippable1)).toEqual(false)
  })

  describe('size', () => {
    it('works', () => {
      expect(testMod.size()).toEqual(0)
      expect(testMod.size([1, 2, 3])).toEqual(3)
      expect(testMod.size({
        equipment: ['a', 3, 6]
      })).toEqual(3)
    })
  })
})

import testMod from './'

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

  describe('kill', () => {
    const equippable = {name: 'rod of testing'}
    const army1 = {id: 'army1'}
    const army2 = {id: 'army2'}
    let armies
    let armyGroup
    let hero
    let casualties

    beforeEach(() => {
      hero = {id: 'hero', equipment: [equippable]}
      armies = [army1, army2, hero]
      armyGroup = {armies}
      casualties = [hero]
    })

    it('works with simple arrays', () => {
      const out = testMod.kill({armyGroup: armies, casualties})
      expect(armies.length).toEqual(2)
      expect(out.casualties.length).toEqual(1)
      expect(out.casualties[0].id).toEqual('hero')
      expect(out.casualties[0].equipment.length).toEqual(0)
      expect(out.equipment.length).toEqual(1)
    })

    it('works with armyGroup structures', () => {
      const out = testMod.kill({armyGroup, casualties})
      expect(armyGroup.armies.length).toEqual(2)
      expect(out.casualties.length).toEqual(1)
      expect(out.casualties[0].id).toEqual('hero')
      expect(out.casualties[0].equipment.length).toEqual(0)
      expect(out.equipment.length).toEqual(1)
    })
  })
})

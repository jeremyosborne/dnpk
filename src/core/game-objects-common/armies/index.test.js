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

  describe('sort', () => {
    const armies = [
      {name: 'hero', id: '1', strength: 3, effects: [{name: 'hero'}]},
      {name: 'pegasus', id: '2', strength: 3, effects: [{name: 'aerial'}]},
      {name: 'dragon', id: '3', strength: 3, effects: [{name: 'aerial'}, {name: 'elite'}]},

      // Use made up types to test for name sorting at the same strength.
      {name: 'light-infantry', id: '4', strength: 4},
      {name: 'cat-infantry', id: '5', strength: 4},
      {name: 'light-infantry', id: '6', strength: 4},
      {name: 'dog-infantry', id: '7', strength: 4},
      {name: 'dog-infantry', id: '8', strength: 4},
      {name: 'light-infantry', id: '9', strength: 4},

      {name: 'light-infantry', id: '10', strength: 4, effects: [{name: 'brawn', modifier: 1}]},
      {name: 'light-infantry', id: '11', strength: 2},
    ]

    it('works with an army-group', () => {
      // Well, it works with something implementing `armies`.
      const armyGroup = {armies}
      const sortedArmyGroup = testMod.sort(armyGroup)

      // Canon fodder in the front, stronger behind, heroes in the back even if
      // hero has less strength.
      expect(testMod.get(sortedArmyGroup, 0).id).toEqual('11')
      // Armies of the same strength get grouped by type.
      expect(testMod.get(sortedArmyGroup, 1).id).toEqual('5')
      expect(testMod.get(sortedArmyGroup, 2).id).toEqual('7')
      expect(testMod.get(sortedArmyGroup, 3).id).toEqual('8')
      expect(testMod.get(sortedArmyGroup, 4).id).toEqual('4')
      expect(testMod.get(sortedArmyGroup, 5).id).toEqual('6')
      expect(testMod.get(sortedArmyGroup, 6).id).toEqual('9')

      expect(testMod.get(sortedArmyGroup, 7).id).toEqual('10')
      expect(testMod.get(sortedArmyGroup, 8).id).toEqual('2')
      expect(testMod.get(sortedArmyGroup, 9).id).toEqual('3')
      expect(testMod.get(sortedArmyGroup, 10).id).toEqual('1')
    })

    it('works with a simple list of armies', () => {
      const sortedArmyGroup = testMod.sort(armies)

      // Canon fodder in the front, stronger behind, heroes in the back even if
      // hero has less strength.
      expect(testMod.get(sortedArmyGroup, 0).id).toEqual('11')
      // Armies of the same strength get grouped by type.
      expect(testMod.get(sortedArmyGroup, 1).id).toEqual('5')
      expect(testMod.get(sortedArmyGroup, 2).id).toEqual('7')
      expect(testMod.get(sortedArmyGroup, 3).id).toEqual('8')
      expect(testMod.get(sortedArmyGroup, 4).id).toEqual('4')
      expect(testMod.get(sortedArmyGroup, 5).id).toEqual('6')
      expect(testMod.get(sortedArmyGroup, 6).id).toEqual('9')

      expect(testMod.get(sortedArmyGroup, 7).id).toEqual('10')
      expect(testMod.get(sortedArmyGroup, 8).id).toEqual('2')
      expect(testMod.get(sortedArmyGroup, 9).id).toEqual('3')
      expect(testMod.get(sortedArmyGroup, 10).id).toEqual('1')
    })
  })
})

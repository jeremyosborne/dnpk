import * as testModule from './'

describe('game-objects.army-group.sort', () => {
  it('works', () => {
    // Minimal test.
    const armyGroup = [
      {name: 'hero', id: '1', strength: 3, effects: [{name: 'hero'}]},
      {name: 'light-infantry', id: '2', strength: 2},
      {name: 'light-infantry', id: '3', strength: 4},
    ]
    const sortedArmyGroup = testModule.sort(armyGroup)

    // Should be copy.
    expect(armyGroup !== sortedArmyGroup).toEqual(true)
    // No in place mutation mutation.
    expect(armyGroup[0].name).toEqual('hero')

    // Canon fodder in the front, stronger + heroes in the back.
    expect(sortedArmyGroup[0].id).toEqual('2')
    expect(sortedArmyGroup[1].id).toEqual('3')
    expect(sortedArmyGroup[2].id).toEqual('1')
  })
})

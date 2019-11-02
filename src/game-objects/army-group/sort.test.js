import * as testModule from './'

describe('game-objects.army-group.sort', () => {
  const armies = [
    {name: 'hero', id: '1', strength: 3, effects: [{name: 'hero'}]},
    {name: 'pegasus', id: '2', strength: 3, effects: [{name: 'aerial'}]},
    {name: 'dragon', id: '3', strength: 3, effects: [{name: 'aerial'}, {name: 'elite'}]},
    {name: 'light-infantry', id: '4', strength: 4},
    {name: 'light-infantry', id: '5', strength: 4, effects: [{name: 'brawn', modifier: 1}]},
    {name: 'light-infantry', id: '6', strength: 2},
  ]

  it('works with an army-group', () => {
    const armyGroup = {armies}
    const sortedArmyGroup = testModule.sort(armyGroup)

    // Canon fodder in the front, stronger behind, heroes in the back even if
    // hero has less strength.
    expect(sortedArmyGroup.armies[0].id).toEqual('6')
    expect(sortedArmyGroup.armies[1].id).toEqual('4')
    expect(sortedArmyGroup.armies[2].id).toEqual('5')
    expect(sortedArmyGroup.armies[3].id).toEqual('2')
    expect(sortedArmyGroup.armies[4].id).toEqual('3')
    expect(sortedArmyGroup.armies[5].id).toEqual('1')
  })

  it('works with a simple list of armies', () => {
    const sortedArmies = testModule.sort(armies)

    // Canon fodder in the front, stronger behind, heroes in the back even if
    // hero has less strength.
    expect(sortedArmies[0].id).toEqual('6')
    expect(sortedArmies[1].id).toEqual('4')
    expect(sortedArmies[2].id).toEqual('5')
    expect(sortedArmies[3].id).toEqual('2')
    expect(sortedArmies[4].id).toEqual('3')
    expect(sortedArmies[5].id).toEqual('1')
  })
})

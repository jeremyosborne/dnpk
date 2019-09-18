import * as testModule from './'

describe('game-objects.army.do.equip', () => {
  it('works', () => {
    const army = {
      equipment: [],
    }
    const equippable = {
      name: 'rusty sword'
    }

    testModule.equip({army, equippable})
    expect(army.equipment.length).toEqual(1)
    expect(army.equipment.indexOf(equippable) > -1).toEqual(true)
  })
})

import * as testMod from './kill'

describe('game-objects.army-group.kill', () => {
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

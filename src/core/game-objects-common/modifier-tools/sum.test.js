import * as testMod from './sum'

describe('gameobjects-common.modifier-tools.sum', () => {
  const armyHero = {
    name: 'hero',
    strength: 4,
    effects: [
      {name: 'hero'}
    ],
    equipment: [
      {effects: [{name: 'brawn-aura', magnitude: 1}]}
    ]
  }
  const objects = [
    {name: 'fortress', type: 'structure', effects: [{name: 'constitution-aura', magnitude: 1}]}
  ]
  const armies = [
    armyHero,
    {name: 'dragon', effects: [{name: 'constitution-aura', magnitude: 1}, {name: 'constitution-aura', magnitude: 1}]},
    {name: 'brawny guy', effects: [{name: 'brawn-aura', magnitude: 1}, {name: 'constitution-aura', magnitude: 2}]}
  ]
  const armyGroup = {
    armies,
  }

  it("doesn't explode when passing in nothing", () => {
    expect(testMod.sum()).toEqual(0)
  })

  it('works with the various ways to pass arguments', () => {
    // the different ways of passing in arguments
    expect(testMod.sum({
      armyGroup,
      effectNames: ['brawn-aura']
    })).toEqual(2)
    expect(testMod.sum({
      objects: armies,
      effectNames: ['brawn-aura']
    })).toEqual(2)
    expect(testMod.sum({
      armyGroup: armies,
      effectNames: ['brawn-aura']
    })).toEqual(2)
    // test concatenation
    expect(testMod.sum({
      objects,
      armyGroup: armies,
      effectNames: ['constitution-aura']
    })).toEqual(5)
  })

  it('really sums up everything we ask it to sum up', () => {
    expect(testMod.sum({
      objects,
      armyGroup: armies,
      effectNames: ['constitution-aura', 'brawn-aura']
    })).toEqual(7)
  })
})

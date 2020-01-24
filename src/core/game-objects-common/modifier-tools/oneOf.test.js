import * as testMod from './oneOf'

describe('gameobjects-common.modifier-tools.oneOf', () => {
  const armyHero = {
    name: 'hero',
    strength: 4,
    effects: [
      {name: 'hero'}
    ],
    equipment: [
      {effects: [{name: 'cat-aura', magnitude: 1}]}
    ]
  }
  const objects = [
    {name: 'fortress', type: 'structure', effects: [{name: 'dog-aura', magnitude: 1}]}
  ]
  const armies = [
    armyHero,
    {name: 'dragon', effects: [{name: 'constitution-aura', magnitude: 1}, {name: 'pig-aura', magnitude: 1}]},
    {name: 'brawny guy', effects: [{name: 'brawn-aura', magnitude: 1}, {name: 'constitution-aura', magnitude: 2}]}
  ]
  const armyGroup = {
    armies,
  }

  it("doesn't explode when passing in nothing", () => {
    expect(testMod.oneOf()).toEqual(0)
  })

  it('works with the various ways to pass arguments', () => {
    // the different ways of passing in arguments
    expect(testMod.oneOf({
      armyGroup,
      effectNames: ['brawn-aura']
    })).toEqual(1)

    expect(testMod.oneOf({
      objects: armies,
      effectNames: ['brawn-aura']
    })).toEqual(1)

    expect(testMod.oneOf({
      armyGroup: armies,
      effectNames: ['brawn-aura']
    })).toEqual(1)

    // test concatenation and value
    expect(testMod.oneOf({
      objects,
      armyGroup: armies,
      effectNames: ['constitution-aura', 'brawn-aura'],
      value: 6,
    })).toEqual(6)
  })

  it('returns 0 in a failed match', () => {
    expect(testMod.oneOf({
      objects,
      armyGroup: armies,
      effectNames: ['poop is not a valid value']
    })).toEqual(0)
  })

  it('matches in all the expected spots', () => {
    expect(testMod.oneOf({
      objects,
      armyGroup: armies,
      effectNames: ['poop', 'hero']
    })).toEqual(1)

    expect(testMod.oneOf({
      objects,
      armyGroup: armies,
      effectNames: ['cat-aura']
    })).toEqual(1)

    expect(testMod.oneOf({
      objects,
      armyGroup: armies,
      effectNames: ['dog-aura']
    })).toEqual(1)

    expect(testMod.oneOf({
      objects,
      armyGroup: armies,
      effectNames: ['pig-aura']
    })).toEqual(1)
  })
})

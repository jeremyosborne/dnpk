import _ from 'lodash'

import * as testMod from './hero'

describe('game-objects-common.is.hero', () => {
  const armyHero = {
    name: 'hero',
    strength: 4,
    effects: [
      {name: 'hero', magnitude: 1}
    ],
    equipment: [
      {effects: [{name: 'brawn-aura', magnitude: 1}]}
    ]
  }

  it('detects a hero', () => {
    const testHero = _.cloneDeep(armyHero)
    expect(testMod.hero(testHero)).toEqual(true)
    // Magnitude doesn't matter, and if it does some day this test should break.
    testHero.effects[0].magnitude = null
    expect(testMod.hero(testHero)).toEqual(true)
  })

  it('detects a non-hero', () => {
    const nonHero = _.cloneDeep(armyHero)
    nonHero.effects = []
    expect(testMod.hero(nonHero)).toEqual(false)
  })
})

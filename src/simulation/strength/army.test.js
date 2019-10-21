import * as testModule from './army'
import * as dataSourceModdables from 'data-source-moddables'
import _ from 'lodash'

// This is likely to break, put it visibly in one spot.
const ASSUMED_STRENGTH_MAXIMUM = 9
const ASSUMED_STRENGTH_MINIMUM = 0

describe('strength.army', () => {
  beforeEach(async () => {
    // load dependencies, needed for strengthBoundary.
    await dataSourceModdables.read()
  })

  describe('strengthModifierHero', () => {
    const armyHero = {
      name: 'hero',
      strength: 4,
      effects: [
        {name: 'hero'}
      ],
      equipment: [
        {effects: [{name: 'command', magnitude: 1}]}
      ]
    }

    it('handles various hero strength', () => {
      const testHero = _.cloneDeep(armyHero)
      testHero.strength = 3
      expect(testModule.strengthModifierHero({army: testHero})).toEqual(0)
      testHero.strength = 4
      expect(testModule.strengthModifierHero({army: testHero})).toEqual(1)
      testHero.strength = 7
      expect(testModule.strengthModifierHero({army: testHero})).toEqual(2)
      testHero.strength = 9
      expect(testModule.strengthModifierHero({army: testHero})).toEqual(3)
    })
  })

  describe('strength()', () => {
    it('works', () => {
      const fakeArmy = {
        strength: 4,
      }
      expect(testModule.strength({army: fakeArmy})).toEqual(4)
    })

    it('works with equipment + effects', () => {
      const fakeArmy = {
        strength: 4,
        effects: [
          {
            name: 'brawn',
            magnitude: 1,
            metadata: {
              name: 'shrine',
              id: '123abc',
            }
          }
        ],
        equipment: [
          {
            name: 'sword of mocking',
            effects: [
              {
                name: 'brawn',
                magnitude: 4,
              }
            ]
          },
          {
            name: 'sword of blah',
            effects: [
              {
                name: 'brawn',
                // In general, this should not even be valid, but we can confirm
                // that this won't give us a NaN style of result.
                magnitude: null
              }
            ]
          }
        ]
      }
      expect(testModule.strength({army: fakeArmy})).toEqual(9)
    })

    it('enforces a min even if missing', () => {
      expect(testModule.strength({army: {}})).toEqual(ASSUMED_STRENGTH_MINIMUM)
    })

    it('enforces a maximum strength', () => {
      const fakeArmy = {
        strength: 6,
        equipment: [
          {
            name: 'sword of mocking',
            effects: [
              {
                name: 'brawn',
                magnitude: 4,
              }
            ]
          }
        ]
      }
      expect(testModule.strength({army: fakeArmy})).toEqual(ASSUMED_STRENGTH_MAXIMUM)
    })

    it('enforces a minimum strength', () => {
      const fakeArmy = {
        strength: 6,
        equipment: [
          {
            name: 'sword of mocking',
            effects: [
              {
                name: 'brawn',
                magnitude: -40,
              }
            ]
          }
        ]
      }
      expect(testModule.strength({army: fakeArmy})).toEqual(ASSUMED_STRENGTH_MINIMUM)
    })
  })
})

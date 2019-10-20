import * as dataSourceModdables from 'data-source-moddables'
import * as testModule from './army'

// This is likely to break, put it visibly in one spot.
const ASSUMED_STRENGTH_MAXIMUM = 9
const ASSUMED_STRENGTH_MINIMUM = 0

describe('strength.army', () => {
  beforeEach(async () => {
    // load dependencies, needed for strengthBoundary.
    await dataSourceModdables.read()
  })

  describe('strength()', () => {
    it('works', () => {
      const fakeArmy = {
        strength: 4,
      }
      expect(testModule.strength({army: fakeArmy})).toEqual(4)
    })

    it('works with effects', () => {
      const fakeArmy = {
        strength: 4,
        equipment: [
          {
            name: 'sword of mocking',
            effects: [
              {
                name: 'strength',
                magnitude: 4,
              }
            ]
          },
          {
            name: 'sword of blah',
            effects: [
              {
                name: 'strength',
                // In general, this should not even be valid, but we can confirm
                // that this won't give us a NaN style of result.
                magnitude: null
              }
            ]
          }
        ]
      }
      expect(testModule.strength({army: fakeArmy})).toEqual(8)
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
                name: 'strength',
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
                name: 'strength',
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

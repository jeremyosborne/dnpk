import * as army from './'
import * as configGameObjects from 'config-game-objects'

// This is likely to break, put it visibly in one spot.
const ASSUMED_STRENGTH_MAXIMUM = 9
const ASSUMED_STRENGTH_MINIMUM = 0

describe('army', () => {
  beforeEach(async () => {
    // load dependencies...
    await configGameObjects.load()
  })

  describe('.strength()', () => {
    it('works', () => {
      const fakeArmy = {
        strength: 4,
      }
      expect(army.strength(fakeArmy)).toEqual(4)
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
          }
        ]
      }
      expect(army.strength(fakeArmy)).toEqual(8)
    })

    it('enforces a min even if missing', () => {
      expect(army.strength({})).toEqual(ASSUMED_STRENGTH_MINIMUM)
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
      expect(army.strength(fakeArmy)).toEqual(ASSUMED_STRENGTH_MAXIMUM)
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
      expect(army.strength(fakeArmy)).toEqual(ASSUMED_STRENGTH_MINIMUM)
    })
  })
})

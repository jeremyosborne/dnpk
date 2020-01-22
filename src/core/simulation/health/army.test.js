import * as testModule from './army'

describe('health.army', () => {
  describe('health()', () => {
    it('works', () => {
      const fakeArmy = {
        health: 2,
      }
      expect(testModule.health({army: fakeArmy})).toEqual(2)
    })

    it('does not explode', () => {
      // Potentially useful for aggregate functions that don't want to be tied
      // to always reporting on the status relative to an army.
      expect(testModule.health()).toEqual(0)
    })

    it('works with equipment + effects', () => {
      const fakeArmy = {
        health: 2,
        effects: [
          {
            name: 'constitution',
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
                name: 'constitution',
                magnitude: 4,
              }
            ]
          },
          {
            name: 'sword of blah',
            effects: [
              {
                name: 'constitution',
                // In general, this should not even be valid, but we can confirm
                // that this won't give us a NaN style of result.
                magnitude: null
              }
            ]
          }
        ]
      }
      expect(testModule.health({army: fakeArmy})).toEqual(7)
    })

    it('has an expected default value', () => {
      expect(testModule.health({army: {}})).toEqual(0)
    })

    it('does not enforce a maximum health', () => {
      const fakeArmy = {
        health: 6,
        equipment: [
          {
            name: 'sword of mocking',
            effects: [
              {
                name: 'constitution',
                magnitude: 4,
              }
            ]
          }
        ]
      }
      expect(testModule.health({army: fakeArmy})).toEqual(10)
    })

    it('does not enforce a minimum health', () => {
      const fakeArmy = {
        health: 6,
        equipment: [
          {
            name: 'sword of mocking',
            effects: [
              {
                name: 'constitution',
                magnitude: -40,
              }
            ]
          }
        ]
      }
      expect(testModule.health({army: fakeArmy})).toEqual(-34)
    })
  })
})

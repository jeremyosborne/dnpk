import * as testModule from './army'
import _ from 'lodash'

describe('strength.army', () => {
  describe('strengthModifierHero', () => {
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
      testHero.strength = 1000
      expect(testModule.strengthModifierHero({army: testHero})).toEqual(3)
    })

    it('does not explode', () => {
      expect(testModule.strengthModifierHero()).toEqual(0)
    })
  })

  describe('strength()', () => {
    it('works', () => {
      const fakeArmy = {
        strength: 4,
      }
      expect(testModule.strength({army: fakeArmy})).toEqual(4)
    })

    it('does not explode', () => {
      // Potentially useful for aggregate functions that don't want to be tied
      // to always reporting on the status relative to an army.
      expect(testModule.strength()).toEqual(0)
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

    it('has an expected default value', () => {
      expect(testModule.strength({army: {}})).toEqual(0)
    })

    it('does not enforce a maximum strength', () => {
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
      expect(testModule.strength({army: fakeArmy})).toEqual(10)
    })

    it('does not enforce a minimum strength', () => {
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
      expect(testModule.strength({army: fakeArmy})).toEqual(-34)
    })
  })
})

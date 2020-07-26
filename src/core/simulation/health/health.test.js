import * as dataSourceModdables from 'data-source-moddables'
import * as testModule from './health'

describe('health', () => {
  const army = {
    name: 'test dummy',
    // Use smaller health value to fit in with the assumed default `classic` value of 4.
    health: 1,
    effects: [
      {
        name: 'constitution',
        magnitude: 1,
      },
      {
        name: 'constitution-aura',
        magnitude: 1,
      },
    ]
  }
  const armies = [
    army,
  ]
  const armyGroup = {
    armies,
  }
  const structure = {
    name: 'city',
    effects: [
      {
        name: 'constitution-aura',
        magnitude: 1,
      }
    ]
  }

  beforeEach(async () => {
    // load dependencies, needed for the someday implemented health boundary.
    await dataSourceModdables.read()
  })

  describe('health()', () => {
    it('works with just an army', () => {
      // When alone, does not account for group only bonuses.
      expect(testModule.health({army})).toEqual(2)
    })

    it('works with army and army-group', () => {
      expect(testModule.health({army, armyGroup})).toEqual(3)
      expect(testModule.health({army, armyGroup: armies})).toEqual(3)
    })

    it('works with army and army-group and structure', () => {
      // Adding a structure bumps to net +1.
      expect(testModule.health({army, armyGroup, structures: structure})).toEqual(4)
      expect(testModule.health({army, armyGroup: armies, structures: structure})).toEqual(4)
    })

    it('throws an error if no army is passed', () => {
      expect(() => testModule.health({})).toThrow()
    })
  })
})

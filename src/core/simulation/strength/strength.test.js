import * as dataSourceModdables from 'data-source-moddables'
import * as testModule from './strength'

describe('strength', () => {
  const army = {
    name: 'test dummy',
    strength: 3,
    effects: [
      {name: 'aerial'},
      {
        name: 'brawn-terrain-modifier',
        magnitude: -1,
        metadata: {
          name: 'forest'
        }
      },
    ]
  }
  const armies = [
    army,
  ]
  const armyGroup = {
    armies,
  }
  const terrain = {name: 'forest'}
  const structure = {
    name: 'city',
    effects: [
      {
        name: 'brawn-aura',
        magnitude: 1,
      }
    ]
  }
  const empire = {
    effects: [
      {
        name: 'brawn-terrain-modifier',
        magnitude: 1,
        metadata: {
          name: 'forest'
        }
      },
    ]
  }

  beforeEach(async () => {
    // load dependencies, needed for strengthBoundary.
    await dataSourceModdables.read()
  })

  describe('strength()', () => {
    it('works with just an army', () => {
      // When alone, does not account for group only bonuses.
      expect(testModule.strength({army})).toEqual(3)
    })

    it('works with army and army-group', () => {
      expect(testModule.strength({army, armyGroup})).toEqual(4)
      expect(testModule.strength({army, armyGroup: armies})).toEqual(4)
    })

    it('works with army and army-group and terrain', () => {
      // Due to terrain modifier, now being calculated, terrain negates the group bonus.
      expect(testModule.strength({army, armyGroup, terrain})).toEqual(3)
      expect(testModule.strength({army, armyGroup: armies, terrain})).toEqual(3)
    })

    it('works with army and army-group and terrain and empire', () => {
      // Adding in the empire negates the negations and we're net 0.
      expect(testModule.strength({army, armyGroup, terrain, empire})).toEqual(4)
      expect(testModule.strength({army, armyGroup: armies, terrain, empire})).toEqual(4)
    })

    it('works with army and army-group and terrain and empire and structure', () => {
      // Adding a structure bumps to net +1.
      expect(testModule.strength({army, armyGroup, terrain, empire, structure})).toEqual(5)
      expect(testModule.strength({army, armyGroup: armies, terrain, empire, structure})).toEqual(5)
    })

    it('throws an error if no army is passed', () => {
      expect(() => testModule.strength({})).toThrow()
    })
  })
})

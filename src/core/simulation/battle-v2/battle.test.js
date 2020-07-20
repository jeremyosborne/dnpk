import * as testMod from './battle'

describe('battle', () => {
  const attackers = {
    armyGroup: [],
    empire: {name: 'good guys'},
  }

  const defenders = {
    armyGroup: [],
    empire: {name: 'other good guys'},
  }

  const terrain = {name: 'plain'}

  beforeEach(async () => {
    // strength boundaries are used but we can opt for the in-code defaults
    // to cut down on the amount of loading we do in these tests.
  })

  describe('battle()', () => {
    it('gets to contribute to the line coverage in a negative way', () => {
      // Let the coverage report, and usuage, define what we should actually
      // be testing.
      expect(!!testMod.battle({attackers, defenders, terrain})).toEqual(true)
    })
  })
})

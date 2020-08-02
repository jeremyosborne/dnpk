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

  const terrains = [{name: 'plain'}]

  beforeEach(async () => {
    // strength boundaries are used but we can opt for the in-code defaults
    // to cut down on the amount of loading we do in these tests.
  })

  describe('battle()', () => {
    it('gets to contribute to the line coverage in a negative way', () => {
      // Let the coverage report, and usuage, define what we should actually
      // be testing.
      expect(!!testMod.battle({attackers, defenders, terrains})).toEqual(true)
    })
  })

  describe('violence()', () => {
    const attacker = {
      strength: 5,
    }
    const defender = {
      strength: 6,
    }

    // Tests slightly brittle due to reliance on the order of attacks and
    // who resolves first, the attacker or defender.
    // Tests assume attacker resolves first.
    it('resolves with no damage if the attacker and defender both roll low', () => {
      const d = jest.fn().mockReturnValueOnce(6).mockReturnValue(4)
      const results = testMod.violence({attacker, defender}, {d})
      expect(results).toEqual({
        attacker: {damaged: false, hit: false, roll: 6},
        defender: {damaged: false, hit: false, roll: 4},
      })
    })

    it('resolves with no damage if the attacker and defender both roll equal', () => {
      const d = jest.fn().mockReturnValueOnce(6).mockReturnValue(5)
      const results = testMod.violence({attacker, defender}, {d})
      expect(results).toEqual({
        attacker: {damaged: false, hit: false, roll: 6},
        defender: {damaged: false, hit: false, roll: 5},
      })
    })

    it('resolves with no damage if the attacker and defender both roll high', () => {
      const d = jest.fn().mockReturnValueOnce(9).mockReturnValue(9)
      const results = testMod.violence({attacker, defender}, {d})
      expect(results).toEqual({
        attacker: {damaged: false, hit: true, roll: 9},
        defender: {damaged: false, hit: true, roll: 9},
      })
    })

    it('resolves with damage to attacker if defender rolls high and attacker rolls low', () => {
      const d = jest.fn().mockReturnValueOnce(5).mockReturnValue(9)
      const results = testMod.violence({attacker, defender}, {d})
      expect(results).toEqual({
        attacker: {damaged: true, hit: false, roll: 5},
        defender: {damaged: false, hit: true, roll: 9},
      })
    })

    it('resolves with damage to attacker if defender rolls high and attacker rolls equal', () => {
      const d = jest.fn().mockReturnValueOnce(6).mockReturnValue(9)
      const results = testMod.violence({attacker, defender}, {d})
      expect(results).toEqual({
        attacker: {damaged: true, hit: false, roll: 6},
        defender: {damaged: false, hit: true, roll: 9},
      })
    })

    it('resolves with damage to defender if attacker rolls high and defender rolls low', () => {
      const d = jest.fn().mockReturnValueOnce(7).mockReturnValue(4)
      const results = testMod.violence({attacker, defender}, {d})
      expect(results).toEqual({
        attacker: {damaged: false, hit: true, roll: 7},
        defender: {damaged: true, hit: false, roll: 4},
      })
    })

    it('resolves with damage to defender if attacker rolls high and defender rolls equal', () => {
      const d = jest.fn().mockReturnValueOnce(7).mockReturnValue(5)
      const results = testMod.violence({attacker, defender}, {d})
      expect(results).toEqual({
        attacker: {damaged: false, hit: true, roll: 7},
        defender: {damaged: true, hit: false, roll: 5},
      })
    })
  })
})

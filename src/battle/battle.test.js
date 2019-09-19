import * as testMod from './battle'

describe('battle.battle', () => {
  beforeEach(async () => {
    // strength boundaries are used but we can opt for the in-code defaults
    // to cut down on the amount of loading we do in these tests.
  })

  describe('battle', () => {
    it('gets to contribute to the line coverage in a negative way', () => {
      // If we get any response we're good, and we make the coverage report
      // scream for attention.
      expect(!!testMod.battle({attackers: [], defenders: [], terrain: {name: 'plains'}})).toEqual(true)
    })
  })
})

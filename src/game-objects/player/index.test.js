import * as player from './'

describe('player', () => {
  beforeEach(async () => {
    // player does not have dependencies on config-game-objects
  })

  describe('.create()', () => {
    it('returns expected object', () => {
      expect(player.create().type).toEqual('player')
    })
  })

  describe('.armyGroups', () => {
    describe('.add', () => {
      it('works as expected', () => {
        const testPlayer = player.create()
        // This test assumes an `armyGroup` is a plain array, which it will likely not always be.
        const testArmyGroup = [{}]
        player.armyGroups.add({player: testPlayer, testArmyGroup})
        expect(testPlayer.armyGroups.length).toEqual(1)
        player.armyGroups.add({player: testPlayer, testArmyGroup})
        // Does not duplicate
        expect(testPlayer.armyGroups.length).toEqual(1)
      })
    })
  })
})

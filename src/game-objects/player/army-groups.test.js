import * as testMod from './'

describe('game-objects.player.armyGroups', () => {
  beforeEach(async () => {
    // player does not have dependencies on data-source-game-objects
  })

  describe('.add', () => {
    it('works as expected', () => {
      const testPlayer = testMod.create()
      // This test assumes an `armyGroup` is a plain array, which it will likely not always be.
      const testArmyGroup = [{}]
      testMod.armyGroups.add({player: testPlayer, testArmyGroup})
      expect(testPlayer.armyGroups.length).toEqual(1)
      testMod.armyGroups.add({player: testPlayer, testArmyGroup})
      // Does not duplicate
      expect(testPlayer.armyGroups.length).toEqual(1)
    })
  })
})

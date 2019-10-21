import * as armyGroup from '../army-group'
import * as testMod from './'

describe('game-objects.player.armyGroups', () => {
  describe('.add', () => {
    it('works as expected', () => {
      const testPlayer = testMod.create()
      const testArmyGroup = armyGroup.create()
      testMod.armyGroups.add({player: testPlayer, armyGroup: testArmyGroup})
      expect(testPlayer.armyGroups.length).toEqual(1)
      testMod.armyGroups.add({player: testPlayer, armyGroup: testArmyGroup})
      // Does not duplicate
      expect(testPlayer.armyGroups.length).toEqual(1)
    })
  })
})

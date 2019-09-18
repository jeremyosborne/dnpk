import * as testMod from './'

describe('game-objects.player.create', () => {
  beforeEach(async () => {
    // player does not have dependencies on config-game-objects
  })

  it('returns expected object', () => {
    expect(testMod.create().type).toEqual('player')
  })
})

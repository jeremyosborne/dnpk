import * as testMod from './'

describe('game-objects.player.create', () => {
  beforeEach(async () => {
    // player does not have dependencies on data-source-game-objects
  })

  it('returns expected object', () => {
    expect(testMod.create().type).toEqual('player')
  })
})

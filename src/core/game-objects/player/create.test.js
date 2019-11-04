import * as testMod from './'

describe('game-objects.player.create', () => {
  it('returns expected object', () => {
    expect(testMod.create().type).toEqual('player')
  })
})

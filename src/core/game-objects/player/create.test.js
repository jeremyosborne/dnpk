import * as testMod from './'

describe('game-objects.player.create', () => {
  it('returns expected object', () => {
    const instance = testMod.create()
    expect(typeof instance.createdAt).toEqual('string')
    expect(typeof instance.id).toEqual('string')
    expect(instance.type).toEqual('player')
  })
})

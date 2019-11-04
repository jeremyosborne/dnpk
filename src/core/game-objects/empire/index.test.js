import * as publicApi from './'

describe('game-objects.empire', () => {
  it('does not export named references to null', () => {
    Object.keys(publicApi).map((key) => expect(!!publicApi[key]).toEqual(true))
  })
})

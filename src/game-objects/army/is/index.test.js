import * as publicApi from './'

describe('army', () => {
  describe('.is', () => {
    it('does not export named references to null', () => {
      Object.keys(publicApi).map((key) => expect(!!publicApi[key]).toEqual(true))
    })
  })
})

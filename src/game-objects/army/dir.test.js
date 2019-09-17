import * as army from './'
import * as configGameObjects from 'config-game-objects'

describe('army', () => {
  beforeEach(async () => {
    // load dependencies...
    await configGameObjects.load()
  })

  describe('.dir()', () => {
    it('works', () => {
      expect(army.dir().length > 0).toEqual(true)
    })
  })
})

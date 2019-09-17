import * as testModule from './'

describe('army', () => {
  describe('.is', () => {
    describe('.hero()', () => {
      it('works', () => {
        expect(testModule.hero({})).toEqual(false)

        expect(testModule.hero({
          effects: [
            {name: 'hero'}
          ]
        })).toEqual(true)
      })
    })
  })
})

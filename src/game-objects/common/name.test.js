import * as testModule from './'

describe('game-objects.common.name', () => {
  it('works', () => {
    // `name()` is potentially affected by loaded l10n data.
    expect(testModule.name({name: 'bob'})).toEqual('bob')
    expect(testModule.name({name: 'bob', nameInstance: 'bobby'})).toEqual('bobby')
  })
})

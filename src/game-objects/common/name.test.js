import * as testModule from './'
import * as l10n from 'l10n'

describe('game-objects.common.name', () => {
  beforeEach(async () => {
    // Needed for our assumed l10n configuration.
    await l10n.read()
  })

  it('works', () => {
    // `name()` is potentially affected by loaded l10n data.
    expect(testModule.name({name: 'bob'})).toEqual('bob')
    expect(testModule.name({name: 'bob', nameInstance: 'bobby'})).toEqual('bobby')
  })
})

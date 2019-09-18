import * as testMod from './'

describe('config-runtime', () => {
  it('does not export named references to null', () => {
    Object.keys(testMod).map((key) => expect(!!testMod[key]).toEqual(true))
  })

  it('dataSource.set()', () => {
    // This will, unfortunately, have a nasty side effect on anything that needs
    // the config run-time during tests. Should be cleaned up when we care.
    testMod.dataSource.set({DOGS: 'ARE FUZZY'})
    expect(testMod.get('DOGS')).toEqual('ARE FUZZY')
  })
})

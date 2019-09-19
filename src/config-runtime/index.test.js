import * as testMod from './'

describe('config-runtime', () => {
  it('does not export named references to null', () => {
    Object.keys(testMod).map((key) => expect(!!testMod[key]).toEqual(true))
  })

  describe('dataSource', () => {
    describe('.get()', () => {
      beforeEach(() => {
        // Nothing in cache.
        testMod.dataSource.set(null)
      })

      it('works with process.env', () => {
        const fakeConfig = {}

        const dataSourceGlobal = {
          exists: jest.fn(() => false),
          get: jest.fn(() => null),
        }
        const dataSourceProcessEnv = {
          exists: jest.fn(() => true),
          get: jest.fn(() => fakeConfig),
        }

        const cachedConfig = testMod.dataSource.get({dataSourceGlobal, dataSourceProcessEnv})

        // Only one will be called.
        expect(dataSourceGlobal.get.mock.calls.length > 0).toEqual(false)
        expect(dataSourceProcessEnv.get.mock.calls.length > 0).toEqual(true)
        expect(cachedConfig).toEqual(fakeConfig)
      })

      it('works with global', () => {
        const fakeGlobal = {DNPK_RUNTIME_CONFIGURATION: {SOME_SETTING: '1'}}

        const dataSourceGlobal = {
          exists: jest.fn(() => true),
          get: jest.fn(() => fakeGlobal),
        }
        const dataSourceProcessEnv = {
          exists: jest.fn(() => false),
          get: jest.fn(() => {}),
        }

        const cachedConfig = testMod.dataSource.get({dataSourceGlobal, dataSourceProcessEnv})

        // Only one will be called.
        expect(dataSourceGlobal.get.mock.calls.length > 0).toEqual(true)
        expect(dataSourceProcessEnv.get.mock.calls.length > 0).toEqual(false)
        expect(cachedConfig).toEqual(fakeGlobal.DNPK_RUNTIME_CONFIGURATION)
      })

      it('fails softly if no global config is available', () => {
        const dataSourceGlobal = {
          // Barring armageddon, there's always a global, but the global might
          // not contain our config dictionary.
          exists: jest.fn(() => true),
          get: jest.fn(() => ({})),
        }
        const dataSourceProcessEnv = {
          exists: jest.fn(() => false),
          get: jest.fn(() => null),
        }

        const cachedConfig = testMod.dataSource.get({dataSourceGlobal, dataSourceProcessEnv})

        // Since global always exists, it always has a chance to be called before
        // being inspected.
        expect(dataSourceGlobal.get.mock.calls.length > 0).toEqual(true)
        expect(dataSourceProcessEnv.get.mock.calls.length > 0).toEqual(false)
        // Should still return an empty object to prevent barfing on key access.n
        expect(cachedConfig).toEqual({})
      })
    })

    describe('.set()', () => {
      afterEach(() => {
        testMod.dataSource.set(null)
      })

      it('works', () => {
        // This will, unfortunately, have a nasty side effect on anything that needs
        // the config run-time during tests. Should be cleaned up when we care.
        testMod.dataSource.set({DOGS: 'ARE FUZZY'})
        expect(testMod.get('DOGS')).toEqual('ARE FUZZY')
      })
    })
  })
})

describe('data-source-process-env', () => {
  const ENV_BAK = process.env

  beforeEach(() => {
    // Allows us to get a clean copy of process.env injected in the module.
    jest.resetModules()
    process.env = null
  })

  afterEach(() => {
    process.env = ENV_BAK
  })

  describe('exists', () => {
    it('returns false when process.env does not exist as expected', () => {
      // `process.env = null`, but we can do another object type.
      process.env = 'hello'
      // Due to how process.env gets injected, yes we need to require() here for
      // the test.
      const testMod = require('./')
      expect(testMod.exists()).toEqual(false)
    })

    it('returns true when process.env does exist as expected', () => {
      process.env = {PATH: 'a/little/something/something'}
      // Due to how process.env gets injected, yes we need to require() here for
      // the test.
      const testMod = require('./')
      expect(testMod.exists()).toEqual(true)
    })
  })

  describe('get', () => {
    it('returns process.env', () => {
      process.env = {PATH: 'a/little/something/something'}
      const testMod = require('./')
      expect(testMod.get()).toEqual(process.env)
    })
  })
})

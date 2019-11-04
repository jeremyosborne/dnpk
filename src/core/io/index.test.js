import * as testMod from './'

// Because just in case this gets passed to a live `fs` function, we really
// don't want this key to exist.
const TEST_KEY = 'somepaththatshouldnotexist/noreallyitshouldnt'

describe('io', () => {
  describe('_genPath', () => {
    it('should return a full path', () => {
      const dataPath = TEST_KEY
      expect(testMod._genPath(dataPath).length > dataPath.length).toEqual(true)
    })
  })

  describe('read', () => {
    it('should resolve with an object', async () => {
      const genPath = jest.fn(() => TEST_KEY)
      const readFile = jest.fn(() => Promise.resolve('{"blah": 42}'))
      const result = await testMod.read(TEST_KEY, {genPath, readFile})

      expect(genPath.mock.calls.length > 0).toEqual(true)
      expect(readFile.mock.calls.length > 0).toEqual(true)
      expect(result.blah).toEqual(42)
    })
  })

  describe('remove', () => {
    it('should go through the motions of removing a file', async () => {
      const genPath = jest.fn(() => TEST_KEY)
      const removeFile = jest.fn(() => Promise.resolve())
      const result = await testMod.remove(TEST_KEY, {genPath, removeFile})

      expect(genPath.mock.calls.length > 0).toEqual(true)
      expect(removeFile.mock.calls.length > 0).toEqual(true)
      expect(result).toEqual(undefined)
    })
  })

  describe('write', () => {
    it('should go through the motions of writing a file', async () => {
      const genPath = jest.fn(() => TEST_KEY)
      const makeDir = jest.fn(() => Promise.resolve())
      const writeFile = jest.fn(() => Promise.resolve())
      const result = await testMod.write(TEST_KEY, {fake: 'data'}, {genPath, makeDir, writeFile})

      expect(genPath.mock.calls.length > 0).toEqual(true)
      expect(writeFile.mock.calls.length > 0).toEqual(true)
      expect(result).toEqual(undefined)
    })
  })
})

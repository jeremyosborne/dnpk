import * as equippable from './'
import * as configGameObjects from 'config-game-objects'

// Assume we'll always have this distinct type...
const TEST_TYPE_VALID = 'firesword'
// ...and never this one.
const TEST_TYPE_INVALID = 'fake'

describe('game-objects.equippable.create', () => {
  beforeEach(async () => {
    // load dependencies...
    await configGameObjects.load()
  })

  it('works', () => {
    const instance = equippable.create({name: TEST_TYPE_VALID})
    expect(typeof instance.id === 'string').toEqual(true)
    expect(instance.type).toEqual('equippable')
  })

  it('breaks on bad name', () => {
    expect(() => equippable.create({name: TEST_TYPE_INVALID})).toThrow()
  })
})

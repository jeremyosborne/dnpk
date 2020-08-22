import * as testModule from './royal'
import * as l10n from 'l10n'

describe('ui.text.naming.royal', () => {
  beforeEach(async () => {
    // Needed for our assumed l10n configuration.
    await l10n.read()
  })

  it('works', () => {
    expect(testModule.string({name: 'bob'})).toEqual('bob')

    expect(testModule.string({
      name: 'bob',
      cosmetics: [
        {name: 'naming-title', value: 'the bobber'},
        {name: 'naming-proper', value: 'bobby'},
        {name: 'deed', value: 'killer of slimes'}
      ]
    })).toEqual('bobby, the bobber, bob, killer of slimes')
    expect(testModule.string({
      name: 'bob',
      cosmetics: [
        {name: 'naming-title', value: 'the bobber'},
      ]
    })).toEqual('the bobber, bob')
    expect(testModule.string({
      name: 'bob',
      cosmetics: [
        {name: 'naming-proper', value: 'bobby'},
      ]
    })).toEqual('bobby, bob')

    expect(testModule.string([
      {
        name: 'bob',
        cosmetics: [
          {name: 'naming-title', value: 'the bobber'},
          {name: 'naming-proper', value: 'bobby'},
          {name: 'deed', value: 'eater of cake'},
        ]
      },
      {
        name: 'dude',
        cosmetics: [
          {name: 'naming-title', value: 'the dude'},
          {name: 'naming-proper', value: 'dudley'},
          {name: 'deed', value: 'eater of cake'},
          {name: 'deed', value: 'sitter of couches'},
        ]
      },
    ])).toEqual('bobby, the bobber, bob, eater of cake; dudley, the dude, dude, eater of cake, sitter of couches')

    expect(testModule.string('bob')).toEqual('bob')
    expect(testModule.string(new String('bob'))).toEqual('bob') // eslint-disable-line no-new-wrappers
  })
})

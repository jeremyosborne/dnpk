import * as testModule from './full'
import * as l10n from 'l10n'

describe('ui.text.naming.full', () => {
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
        {name: 'naming-flavor', value: 'orcish'},
      ]
    })).toEqual('bobby, bob (orcish)')
    expect(testModule.string({
      name: 'bob',
      cosmetics: [
        {name: 'naming-title', value: 'the bobber'},
      ]
    })).toEqual('bob')
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
          {name: 'naming-flavor', value: 'orcish'},
        ]
      },
      {
        name: 'dude',
        cosmetics: [
          {name: 'naming-title', value: 'the dude'},
          {name: 'naming-proper', value: 'dudley'},
          {name: 'naming-flavor', value: 'human'},
        ]
      },
    ])).toEqual('bobby, bob (orcish); dudley, dude (human)')

    expect(testModule.string('bob')).toEqual('bob')
    expect(testModule.string(new String('bob'))).toEqual('bob') // eslint-disable-line no-new-wrappers
  })
})

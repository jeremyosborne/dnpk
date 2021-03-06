import * as testModule from './short'
import * as l10n from 'l10n'

describe('ui.text.naming.short', () => {
  beforeEach(async () => {
    // Needed for our assumed l10n configuration.
    await l10n.read()
  })

  describe('string', () => {
    it('works', () => {
      expect(testModule.string({name: 'bob'})).toEqual('bob')
      expect(testModule.string({name: 'bob', cosmetics: [{name: 'naming-proper', value: 'bobby'}]})).toEqual('bobby')
      expect(testModule.string('bob')).toEqual('bob')
      expect(testModule.string(new String('bob'))).toEqual('bob') // eslint-disable-line no-new-wrappers
    })
  })
})

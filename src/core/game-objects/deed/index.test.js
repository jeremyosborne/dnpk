import {TYPE} from './constants'
import * as publicApi from './'

describe(`game-objects.${TYPE}`, () => {
  it('does not export named references to null', () => {
    Object.keys(publicApi).map((key) => expect(!!publicApi[key]).toEqual(true))
  })
})

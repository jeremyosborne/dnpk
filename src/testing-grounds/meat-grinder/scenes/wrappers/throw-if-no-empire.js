import * as dataSourceGame from 'data-source-game'
import _ from 'lodash'

export const throwIfNoEmpire = (f) => {
  return async (...args) => {
    const protagonist = dataSourceGame.protagonist.get()
    if (!_.get(protagonist, 'empire')) {
      throw new Error('Error: entering a scene without an army group.')
    }

    return f(...args)
  }
}

export default throwIfNoEmpire

export {createRandom} from './create-random'
export {createRandomWeightedArmyGroup} from './create-random-weighted-army-group'

export {randomNaming} from './random-naming'
export {randomWeightedArmies, randomWeightedArmyWeighting} from './random-weighted-armies'

import * as randomTerrain from './random-terrain' // eslint-disable-line import/first
export {randomTerrain}

// In general, one wants the strength method alone, but to allow the export
// of helper methods, named methods from module.
import * as strength from './strength' // eslint-disable-line import/first
export {strength}

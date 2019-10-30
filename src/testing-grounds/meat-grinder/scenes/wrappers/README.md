# Scene function wrappers

Function wrappers to handle recurring themes and requirements for the scenes.

## Sample Usage

```js
import * as wrappers from './wrappers'
import _ from 'lodash'

export const scene () => {
    // bad things happen, digital entities die, etc.
}

export default _.flow([
  wrappers.throwIfNoEmpire,
  wrappers.throwIfNoArmyGroup,
])(scene)
```

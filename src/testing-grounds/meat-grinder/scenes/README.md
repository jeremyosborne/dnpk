# Scenes

The individual scenes (levels, stages, etc.), of the meat-grinder.

## Dev notes

```js
// Each new scene will be listed in `scene-names.js`. Please use these constants
// for named scene transitions vs. bare strings.
import * as sceneNames from './scene-names'

// Each file defines a `scene` function, which is assumed to be async and will
// be treated as such.
//
// This named method is provided for testing (not that we're actually doing that
// right now) and should exported as convenience.
export const scene = async () => {

    // Various return values will be respected by the `game-loop`.
    // This is a simple "go to the named scene" when done.
    return sceneNames.FIGHT
}

// The value exported by default is the game-ready version of the scene, and is
// where wrappers, if any, should be applied.
export default _.flow([
  wrappers.throwIfNoEmpire,
  wrappers.throwIfNoArmyGroup,
])(scene)
```

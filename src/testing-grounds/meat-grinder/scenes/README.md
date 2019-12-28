# Scenes

The individual scenes (levels, stages, etc.), of the meat-grinder.

## Dev notes

* Files and folders represent scenes, with the exceptions of the following:
    * `scene-names.js` maps vars-as-constants to the names of the scenes as exported from this module. Every new scene must be listed in this module and then have a matching export provided in `index.js`.
    * `scene-choices.js` provides scene-to-scene transitions as functions that can be returned from a scene.
    * `wrappers` apply to scene functions before exporting to add common functionality and protections.

```js
// While `scene-names` constants can be used to transition to a particular scene,
// prefer the sceneChoices.
import * as sceneChoices from './scene-choices'

// Each file defines a `scene` function, which is assumed to be an async function
// and will be called as such.
//
// A scene is done when it returns.
//
// The name of scene should be `scene`, although it is assumed the default
// export will be used.
export const scene = async () => {
    // Various return values will be respected by the `game-loop`.
    // This is a simple "go to the named scene" when done.
    return sceneChoices.violent()
}

// The value exported by default is the game-ready version of the scene, and is
// where wrappers, if any, should be applied.
export default _.flow([
  wrappers.throwIfNoEmpire,
  wrappers.throwIfNoArmyGroup,
])(scene)
```

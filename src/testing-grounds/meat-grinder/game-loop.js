import _ from 'lodash'
import * as scenes from './scenes'

/**
 * Runs the meat-grinder game.
 *
 * Call this from the controlling menu to start a particular run. Acts as
 * a director method that queues up a set of scenes.
 *
 * Each scene is an async function that, on completion of the scene, must
 * return one of:
 *
 * - a `function` (can be async) that returns a string name of the next scene
 * - a `string` name of the next scene
 * - `null`, indicating we're done.
 *
 * @return {Promise}
 */
export const gameLoop = async () => {
  //
  // `scenes.prereq` performs some setup and should always be the first in the queue.
  //
  const queue = [scenes.prereq]

  while (queue.length) {
    const scene = queue.shift()
    let next = await scene()
    if (typeof next === 'function') {
      next = await next()
    }

    if (typeof next === 'string') {
      const nextScene = scenes[next]
      if (typeof nextScene !== 'function') {
        throw new Error(`scene '${next}' does not exist as an actionable scene.`)
      }
      queue.push(nextScene)
    } else if (_.isNull(next)) {
      // do nothing
    } else {
      throw new Error('typeof next must ultimately evaluate to a `string` pointing to a valid scene name or `null` to terminate the game loop.')
    }
  }
}

export default gameLoop
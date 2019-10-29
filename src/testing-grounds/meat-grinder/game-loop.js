import _ from 'lodash'
import * as scenes from './scenes'

export const gameLoop = async () => {
  //
  // `scenes.prereq` is special and sets up so the game can be played.
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
    } else if (!_.isNull(next)) {
      throw new Error('typeof next must ultimately evaluate to a `string` pointing to a valid scene name or `null` to terminate the game loop.')
    }
  }
}

export default gameLoop

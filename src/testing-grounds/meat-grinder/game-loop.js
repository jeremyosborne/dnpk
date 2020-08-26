import * as gameObjects from 'game-objects'
import * as dataSourceGame from 'meat-grinder/data-source-game'
import _ from 'lodash'
import * as scenes from './scenes'
import terrainGenerator from './terrain-generator'

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

  let gameState = {
    protagonist: {
      armyGroup: dataSourceGame.protagonist.getArmyGroup() || gameObjects.armyGroup.create(),
      empire: dataSourceGame.protagonist.get().empire,
    },
    // Pre-req is considered turn 0, not a real turn.
    turn: 0,
    terrain: terrainGenerator(0),
  }

  while (queue.length) {
    const scene = queue.shift()
    let next = await scene(gameState)

    // Save the game state after every scene.
    await dataSourceGame.write()

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

    // Prepare for next turn.
    gameState = {
      protagonist: {
        armyGroup: dataSourceGame.protagonist.getArmyGroup() || gameObjects.armyGroup.create(),
        empire: dataSourceGame.protagonist.get().empire,
      },
      turn: gameState.turn + 1,
      terrain: terrainGenerator(gameState.turn)
    }
  }
}

export default gameLoop

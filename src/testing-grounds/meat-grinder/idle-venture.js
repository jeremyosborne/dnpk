import sceneFight from './scene-fight'

function * sceneGenerator () {
  //
  // There should be a starting scene that makes sure initial pre-reqs are met.
  //
  const queue = [sceneFight]
  while (queue.length) {
    yield queue.pop()
    //
    // TODO: repopulate the queue if it is empty based on the state of the game.
    // TODO: Need an escape hatch for the player and allow them to end the current adventure.
    //
  }
}

export const gameLoop = async () => {
  for (const scene of sceneGenerator()) {
    await scene()
  }
}

export default gameLoop

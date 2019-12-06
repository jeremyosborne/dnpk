// @flow

// Current state of the game, handed to every scene when called.
export type GameState = {
  // What is the current turn of the game?
  // The first turn of the game happens on turn 1.
  turn: number,
}

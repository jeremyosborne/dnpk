// Current state of the game, handed to every scene when called.
export type GameState = {
  // Every turn of the meat grinder advances the game one terrain unit forward.
  // It is the choice of the scene on how to represent it, and a complex
  // scene can spend as much time as necessary on a single terrain type.
  terrain: any;
  // What is the current turn of the game?
  // The first turn of the game happens on turn 1.
  turn: number;
};

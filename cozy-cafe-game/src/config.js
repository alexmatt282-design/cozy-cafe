export const GAME_CONFIG = {
  // Game window
  width: 960,
  height: 640,

  // Every tile in the game is 32x32 pixels
  tileSize: 32,

  // Scale sprites up so they look like cozy pixel art
  spriteScale: 2,

  // Colors
  backgroundColor: "#f6efe6",

  // Player
  player: {
    speed: 120,

    // Player spritesheet
    frameWidth: 32,
    frameHeight: 32
  },

  // Customers
  customer: {
    speed: 80,

    frameWidth: 32,
    frameHeight: 32
  },

  // Food animations
  food: {
    frameWidth: 32,
    frameHeight: 32
  },

  // Café grid
  cafe: {
    columns: 30,
    rows: 20
  }
};
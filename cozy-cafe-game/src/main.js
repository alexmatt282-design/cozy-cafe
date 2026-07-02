import Phaser from "phaser";

import { GAME_CONFIG } from "./config.js";
import BootScene from "./scenes/BootScene.js";
import CafeScene from "./scenes/CafeScene.js";

const game = new Phaser.Game({
  type: Phaser.AUTO,

  width: GAME_CONFIG.width,
  height: GAME_CONFIG.height,

  backgroundColor: GAME_CONFIG.backgroundColor,

  pixelArt: true,

  physics: {
    default: "arcade",
    arcade: {
      debug: false
    }
  },

  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },

  scene: [
    BootScene,
    CafeScene
  ]
});

export default game;
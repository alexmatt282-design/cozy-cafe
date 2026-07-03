import Phaser from "phaser";

export default class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    // -------------------------
    // PLAYER ANIMATION FRAMES
    // -------------------------
    this.load.image("player_1", "src/assets/player_1.png");
    this.load.image("player_2", "src/assets/player_2.png");
    this.load.image("player_3", "src/assets/player_3.png");

    // -------------------------
    // CUSTOMERS
    // -------------------------
    this.load.image("customer1", "src/assets/customer_1.png");
    this.load.image("customer2", "src/assets/customer_2.png");
    this.load.image("customer3", "src/assets/customer_3.png");

    this.load.image("customerSit1", "src/assets/customer_sit_1.png");
    this.load.image("customerSit2", "src/assets/customer_sit_2.png");
    this.load.image("customerSit3", "src/assets/customer_sit_3.png");

    // -------------------------
    // FOOD (STRAWBERRY CAKE FRAMES)
    // -------------------------
    this.load.image("cake_strawberry_1", "src/assets/cake_strawberry_1.png");
    this.load.image("cake_strawberry_2", "src/assets/cake_strawberry_2.png");
    this.load.image("cake_strawberry_3", "src/assets/cake_strawberry_3.png");
    this.load.image("cake_strawberry_4", "src/assets/cake_strawberry_4.png");
    this.load.image("cake_strawberry_5", "src/assets/cake_strawberry_5.png");
    this.load.image("cake_strawberry_6", "src/assets/cake_strawberry_6.png");
    this.load.image("cake_strawberry_7", "src/assets/cake_strawberry_7.png");
    this.load.image("cake_strawberry_8", "src/assets/cake_strawberry_8.png");

    // -------------------------
    // FOOD (MATCHA LATTE FRAMES)
    // -------------------------
    this.load.image("matcha_latte_1", "src/assets/matcha_latte_1.png");
    this.load.image("matcha_latte_2", "src/assets/matcha_latte_2.png");
    this.load.image("matcha_latte_3", "src/assets/matcha_latte_3.png");
    this.load.image("matcha_latte_4", "src/assets/matcha_latte_4.png");
    this.load.image("matcha_latte_5", "src/assets/matcha_latte_5.png");
    this.load.image("matcha_latte_6", "src/assets/matcha_latte_6.png");
    this.load.image("matcha_latte_7", "src/assets/matcha_latte_7.png");
    this.load.image("matcha_latte_8", "src/assets/matcha_latte_8.png");

    // -------------------------
    // FURNITURE
    // -------------------------
    this.load.image("table_1", "src/assets/table.png");
    this.load.image("chair_1", "src/assets/chair.png");
  }

  create() {
    // Strawberry Cake Eating Animation
this.anims.create({
  key: "cakeEat",
  frames: [
    { key: "cake_strawberry_1" },
    { key: "cake_strawberry_2" },
    { key: "cake_strawberry_3" },
    { key: "cake_strawberry_4" },
    { key: "cake_strawberry_5" },
    { key: "cake_strawberry_6" },
    { key: "cake_strawberry_7" },
    { key: "cake_strawberry_8" }
  ],
  frameRate: 4,
  repeat: 0
});

// Matcha Drinking Animation
this.anims.create({
  key: "matchaDrink",
  frames: [
    { key: "matcha_latte_1" },
    { key: "matcha_latte_2" },
    { key: "matcha_latte_3" },
    { key: "matcha_latte_4" },
    { key: "matcha_latte_5" },
    { key: "matcha_latte_6" },
    { key: "matcha_latte_7" },
    { key: "matcha_latte_8" }
  ],
  frameRate: 4,
  repeat: 0
});
    this.scene.start("CafeScene");
  }
}
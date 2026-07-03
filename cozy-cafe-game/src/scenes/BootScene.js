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
    this.load.image("customer4", "src/assets/customer_4.png");
    this.load.image("customer5", "src/assets/customer_5.png");
    this.load.image("customer6", "src/assets/customer_6.png");
    this.load.image("customer7", "src/assets/customer_7.png");
    this.load.image("customer8", "src/assets/customer_8.png");


    this.load.image("customerSit1", "src/assets/customer_sit_1.png");
    this.load.image("customerSit2", "src/assets/customer_sit_2.png");
    this.load.image("customerSit3", "src/assets/customer_sit_3.png");
    this.load.image("customerSit4", "src/assets/customer_sit_4.png");
    this.load.image("customerSit5", "src/assets/customer_sit_5.png");
    this.load.image("customerSit6", "src/assets/customer_sit_6.png");
    this.load.image("customerSit7", "src/assets/customer_sit_7.png");
    this.load.image("customerSit8", "src/assets/customer_sit_8.png");

    // -------------------------
    // FOOD (STRAWBERRY CAKE FRAMES)
    // -------------------------
    this.load.image("cake_strawberry_1", "src/assets/cake_strawberry_1.png");
   

    // -------------------------
    // FOOD (MATCHA LATTE FRAMES)
    // -------------------------
    this.load.image("matcha_latte_1", "src/assets/matcha_latte_1.png");
   

    // -------------------------
// ADDITIONAL FOOD
// -------------------------
this.load.image("coffee_1", "src/assets/coffee_1.png");
this.load.image("tea_1", "src/assets/tea_1.png");
this.load.image("latte_regular_1", "src/assets/latte_regular_1.png");
this.load.image("cinnamon_latte_1", "src/assets/cinnamon_latte_1.png");
this.load.image("strawberry_milkshake_1", "src/assets/strawberry_milkshake_1.png");
this.load.image("iced_coffee_1", "src/assets/iced_coffee_1.png");
this.load.image("lemonade_1", "src/assets/lemonade_1.png");
this.load.image("cocoa_1", "src/assets/cocoa_1.png");
this.load.image("cinnamon_roll_1", "src/assets/cinnamon_roll_1.png");
this.load.image("macaron_1", "src/assets/macaron_1.png");
this.load.image("chocolate_muffin_1", "src/assets/chocolate_muffin_1.png");
this.load.image("pudding_1", "src/assets/pudding_1.png");
this.load.image("cappucino_1", "src/assets/cappucino_1.png");

    // -------------------------
    // FURNITURE
    // -------------------------
    this.load.image("table_1", "src/assets/table.png");
    this.load.image("chair_1", "src/assets/chair.png");
  }

  create() {
    // Strawberry Cake Eating Animation

    this.scene.start("CafeScene");
  }
}
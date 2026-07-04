import Phaser from "phaser";

export default class CafeScene extends Phaser.Scene {
  constructor() {
    super("CafeScene");
  }

  preload() {
    // PLAYER
    this.load.spritesheet("player", "/src/assets/player.png", {
      frameWidth: 32,
      frameHeight: 32
    });

    // CUSTOMERS
    this.load.spritesheet("c1", "/src/assets/customer_1.png", {
      frameWidth: 32,
      frameHeight: 32
    });

    this.load.spritesheet("c2", "/src/assets/customer_2.png", {
      frameWidth: 32,
      frameHeight: 32
    });

    this.load.spritesheet("c3", "/src/assets/customer_3.png", {
      frameWidth: 32,
      frameHeight: 32
    });

    this.load.spritesheet("c1s", "/src/assets/customer_sit_1.png", {
      frameWidth: 32,
      frameHeight: 32
    });

    this.load.spritesheet("c2s", "/src/assets/customer_sit_2.png", {
      frameWidth: 32,
      frameHeight: 32
    });

    this.load.spritesheet("c3s", "/src/assets/customer_sit_3.png", {
      frameWidth: 32,
      frameHeight: 32
    });

    // FOOD
    this.load.spritesheet("cake", "/src/assets/cake_strawberry.png", {
      frameWidth: 32,
      frameHeight: 32
    });

    this.load.spritesheet("latte", "/src/assets/matcha_latte.png", {
      frameWidth: 32,
      frameHeight: 32
    });

    // FURNITURE
    this.load.image("chair", "/src/assets/chair.png");
    this.load.image("table", "/src/assets/table.png");
  }

  create() {
    // -------------------------
    // CAMERA FIX
    // -------------------------
    this.cameras.main.setZoom(1.5);
    this.cameras.main.startFollow(this.player, true);
    this.cameras.main.centerOn(450, 300);

    // BACKGROUND
    this.add.rectangle(450, 300, 900, 600, 0x2b2b3c).setDepth(-10);

    // -------------------------
    // PLAYER
    // -------------------------
    this.player = this.physics.add.sprite(100, 300, "player", 0);
    this.player.setScale(2);
    this.player.setCollideWorldBounds(true);

    this.cursors = this.input.keyboard.createCursorKeys();

    // -------------------------
    // CAFÉ SEATING (FIXED LAYERS)
    // -------------------------
    this.chairs = [];

    const seats = [
      [300, 200],
      [500, 200],
      [300, 400],
      [500, 400]
    ];

    seats.forEach(([x, y]) => {
      // TABLE (IN FRONT)
      const table = this.add.image(x, y, "table");
      table.setDisplaySize(120, 120);
      table.setDepth(3);

      // CHAIR (SLIGHTLY BEHIND TABLE)
      const chair = this.physics.add.staticSprite(x, y + 10, "chair");
      chair.setDisplaySize(90, 90);
      chair.setDepth(1);

      this.chairs.push({
        sprite: chair,
        occupied: false
      });
    });

    // -------------------------
    // FOOD DECOR
    // -------------------------
    this.add.sprite(200, 120, "cake", 0).setDisplaySize(48, 48).setDepth(2);
    this.add.sprite(600, 120, "latte", 0).setDisplaySize(48, 48).setDepth(2);

    // -------------------------
    // CUSTOMER LOOP
    // -------------------------
    this.time.addEvent({
      delay: 4000,
      loop: true,
      callback: () => this.spawnCustomer()
    });
  }

  spawnCustomer() {
    const types = ["c1", "c2", "c3"];
    const sitTypes = ["c1s", "c2s", "c3s"];

    const i = Phaser.Math.Between(0, 2);

    const customer = this.physics.add.sprite(850, 300, types[i], 0);
    customer.setScale(2);
    customer.setDepth(2);

    const chair = this.chairs.find(c => !c.occupied);
    if (!chair) return;

    chair.occupied = true;

    this.physics.moveToObject(customer, chair.sprite, 120);

    this.time.delayedCall(1500, () => {
      customer.setVelocity(0);

      // SNAP TO SEAT POSITION
      customer.x = chair.sprite.x;
      customer.y = chair.sprite.y;

      customer.setTexture(sitTypes[i], 0);

      this.time.delayedCall(3000, () => {
        chair.occupied = false;
        customer.destroy();
      });
    });
  }

  update() {
    this.player.setVelocity(0);

    if (this.cursors.left.isDown) this.player.setVelocityX(-160);
    else if (this.cursors.right.isDown) this.player.setVelocityX(160);

    if (this.cursors.up.isDown) this.player.setVelocityY(-160);
    else if (this.cursors.down.isDown) this.player.setVelocityY(160);
  }
}
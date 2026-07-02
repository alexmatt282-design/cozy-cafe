import Phaser from "phaser";

export default class CafeScene extends Phaser.Scene {
  constructor() {
    super("CafeScene");
  }

  create() {
    const TILE = 32;

    this.physics.world.setBounds(0, 0, 1200, 900);
    this.cameras.main.setBounds(0, 0, 1200, 900);
    this.cameras.main.setZoom(2);

    this.add.rectangle(600, 450, 1200, 900, 0xf6efe6);

    // INPUT
    this.cursors = this.input.keyboard.createCursorKeys();

    this.keys = this.input.keyboard.addKeys({
      one: Phaser.Input.Keyboard.KeyCodes.ONE,
      two: Phaser.Input.Keyboard.KeyCodes.TWO,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE
    });

    // PLAYER
    this.player = this.physics.add.sprite(300, 300, "player_1");
    this.player.setScale(0.2);
    this.player.setOrigin(0.5, 1);
    this.player.setDepth(10);

    this.cameras.main.startFollow(this.player);

    this.getHandPos = () => {
      const b = this.player.getBounds();
      return {
        x: this.player.x,
        y: b.y + b.height * 0.45
      };
    };

    this.heldItem = null;
    this.heldSprite = null;

    // -----------------------------
    // FIXED BASELINE SYSTEM
    // -----------------------------
    this.tables = [];

    const layout = [
      { x: 8, y: 6 },
      { x: 11, y: 6 },
      { x: 8, y: 9 },
      { x: 11, y: 9 }
    ];

    layout.forEach(pos => {
      const x = pos.x * TILE;

      // 🔥 THIS IS THE KEY FIX:
      // treat y as "TABLE SURFACE"
      const surfaceY = pos.y * TILE;

      // TABLE sits BELOW surface slightly
      this.add.image(x, surfaceY + 12, "table_1")
        .setDisplaySize(64, 64)
        .setOrigin(0.5, 1)
        .setDepth(3);

      // CHAIR sits slightly lower again
      this.add.image(x, surfaceY + 20, "chair_1")
        .setDisplaySize(48, 48)
        .setOrigin(0.5, 1)
        .setDepth(2);

      this.tables.push({
        x,
        surfaceY,
        seatX: x,
        seatY: surfaceY + 20,
        foodX: x,
        foodY: surfaceY + 8,
        occupied: false,
        foodSprite: null
      });
    });

    // CUSTOMERS
    this.customers = [];

    this.time.addEvent({
      delay: 3000,
      loop: true,
      callback: () => this.spawnCustomer()
    });
  }

  spawnCustomer() {
    const types = ["customer1", "customer2", "customer3"];
    const sitTypes = ["customerSit1", "customerSit2", "customerSit3"];
    const orders = ["cake_strawberry", "matcha_latte"];

    const table = this.tables.find(t => !t.occupied);
    if (!table) return;

    table.occupied = true;

    const customer = this.physics.add.sprite(
      40,
      60 + this.customers.length * 60,
      types[Phaser.Math.Between(0, 2)]
    );

    customer.setScale(0.14);
    customer.setOrigin(0.5, 1);
    customer.setDepth(2);

    this.customers.push({
      sprite: customer,
      sitTexture: sitTypes[Phaser.Math.Between(0, 2)],
      order: orders[Phaser.Math.Between(0, 1)],
      table,
      state: "walking",
      targetX: table.seatX,
      targetY: table.seatY
    });
  }

  update() {
    const speed = 200;

    // PLAYER MOVE
    this.player.setVelocity(0);

    if (this.cursors.left.isDown) this.player.setVelocityX(-speed);
    else if (this.cursors.right.isDown) this.player.setVelocityX(speed);

    if (this.cursors.up.isDown) this.player.setVelocityY(-speed);
    else if (this.cursors.down.isDown) this.player.setVelocityY(speed);

    // EQUIP
    if (Phaser.Input.Keyboard.JustDown(this.keys.one)) {
      this.equipItem("cake_strawberry");
    }

    if (Phaser.Input.Keyboard.JustDown(this.keys.two)) {
      this.equipItem("matcha_latte");
    }

    // SERVE
    if (Phaser.Input.Keyboard.JustDown(this.keys.space)) {
      if (this.heldItem) {
        this.customers.forEach(c => {

          const dist = Phaser.Math.Distance.Between(
            this.player.x,
            this.player.y,
            c.sprite.x,
            c.sprite.y
          );

          if (dist < 60 && c.state === "seated") {

            const t = c.table;

            if (t.foodSprite) t.foodSprite.destroy();

            // 🔥 NOW PERFECTLY ALIGNED TO SURFACE
            t.foodSprite = this.add.image(
              t.foodX,
              t.foodY,
              `${this.heldItem}_1`
            )
              .setScale(0.08)
              .setDepth(4);

            this.heldItem = null;

            if (this.heldSprite) this.heldSprite.destroy();

            c.state = "eating";

            this.time.delayedCall(2000, () => {
              c.sprite.destroy();
              t.occupied = false;
              this.customers = this.customers.filter(x => x !== c);
            });
          }
        });
      }
    }

    // CUSTOMER LOGIC
    this.customers.forEach(c => {

      if (c.state === "walking") {
        const dx = c.targetX - c.sprite.x;
        const dy = c.targetY - c.sprite.y;

        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 2) {
          c.sprite.setVelocity((dx / dist) * 120, (dy / dist) * 120);
        } else {
          c.sprite.setVelocity(0, 0);
          c.state = "seated";
          c.sprite.setTexture(c.sitTexture);
        }
      }
    });

    // PLAYER ITEM FOLLOW HAND
    if (this.heldSprite) {
      const hand = this.getHandPos();
      this.heldSprite.setPosition(hand.x, hand.y);
    }
  }

  equipItem(item) {
    this.heldItem = item;

    if (this.heldSprite) this.heldSprite.destroy();

    const hand = this.getHandPos();

    this.heldSprite = this.add.image(
      hand.x,
      hand.y,
      `${item}_1`
    );

    this.heldSprite.setScale(0.08);
    this.heldSprite.setDepth(11);
  }
}
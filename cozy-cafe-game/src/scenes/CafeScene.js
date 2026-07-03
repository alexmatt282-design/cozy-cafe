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
    this.player.setScale(0.24);
    this.player.setOrigin(0.5, 1);
    this.player.setDepth(10);

    this.cameras.main.startFollow(this.player);

    this.getHandPos = () => {
      const b = this.player.getBounds();
      return {
        x: this.player.x,
        y: b.y + b.height * 0.50
      };
    };

    this.heldItem = null;
    this.heldSprite = null;
    // Walking animation
    this.walkFrame = 1;
    this.walkTimer = 0;

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
      this.add.image(x, surfaceY + 33, "table_1")
        .setDisplaySize(76, 76)
        .setOrigin(0.5, 1)
        .setDepth(3);

      // CHAIR sits slightly lower again
      this.add.image(x, surfaceY + 20, "chair_1")
        .setDisplaySize(58, 58)
        .setOrigin(0.5, 1)
        .setDepth(2);

      this.tables.push({
        x,
        surfaceY,
        seatX: x,
        seatY: surfaceY + 20,
        foodX: x,
        foodY: surfaceY + -15,
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

    customer.setScale(0.17);
    customer.setOrigin(0.5, 1);
    customer.setDepth(2);

    const typeIndex = Phaser.Math.Between(0, 2);

this.customers.push({
  sprite: customer,
  sitTexture: sitTypes[typeIndex],
  walkTexture: types[typeIndex],
  isStanding: false,
  order: orders[Phaser.Math.Between(0, 1)],
  table,
  state: "walking",
  targetX: table.seatX,
  targetY: table.seatY,

  // exit position (left side of screen)
  exitX: -50,
  exitY: 60 + this.customers.length * 60
});
  }

  update() {
    const speed = 200;

    // PLAYER MOVE
   // PLAYER MOVE
this.player.setVelocity(0);

let moving = false;

if (this.cursors.left.isDown) {
  this.player.setVelocityX(-speed);
  moving = true;
}
else if (this.cursors.right.isDown) {
  this.player.setVelocityX(speed);
  moving = true;
}

if (this.cursors.up.isDown) {
  this.player.setVelocityY(-speed);
  moving = true;
}
else if (this.cursors.down.isDown) {
  this.player.setVelocityY(speed);
  moving = true;
}

// Animate player while moving
if (moving) {

  this.walkTimer++;

  if (this.walkTimer >= 8) {

    this.walkTimer = 0;

    this.walkFrame++;

    if (this.walkFrame > 3) {
      this.walkFrame = 1;
    }
    console.log("Switching to", `player_${this.walkFrame}`);
    this.player.setTexture(`player_${this.walkFrame}`);
  }

} else {

  this.walkFrame = 1;
  this.walkTimer = 0;

  if (this.player.texture.key !== "player_1") {
    this.player.setTexture("player_1");
  }

};

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
            t.foodSprite = this.add.sprite(
  t.foodX,
  t.foodY,
  `${this.heldItem}_1`
);

t.foodSprite.setScale(0.10);
t.foodSprite.setDepth(4);

// store what animation to use
t.foodSprite.foodType = this.heldItem;

if (this.heldItem === "cake_strawberry") {
    t.foodSprite.anims.play("cakeEat");
}
else if (this.heldItem === "matcha_latte") {
    t.foodSprite.anims.play("matchaDrink");
}
            this.heldItem = null;

            if (this.heldSprite) this.heldSprite.destroy();

            c.state = "eating";

            this.time.delayedCall(2000, () => {

  if (t.foodSprite) {
    t.foodSprite.destroy();
    t.foodSprite = null;
  }

  // SAFE: use stored textures instead of undefined variable
  c.sprite.setTexture(c.walkTexture);
  c.state = "leaving";

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

  else if (c.state === "leaving") {

  // safety guard (prevents crash if data missing)
  if (!c.sprite || !c.sprite.active) return;

  // make sure they are standing (fallback-safe)
  if (!c.isStanding) {
    c.sprite.setTexture(c.walkTexture || c.sitTexture);
    c.isStanding = true;
  }

 const dx = c.exitX - c.sprite.x;
 const dy = 0;

  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist > 5) {
    c.sprite.setVelocity((dx / dist) * 120, (dy / dist) * 120);
  } else {

    c.sprite.destroy();
    c.table.occupied = false;

    this.customers = this.customers.filter(x => x !== c);
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

    this.heldSprite.setScale(0.10);
    this.heldSprite.setDepth(11);
  }
}
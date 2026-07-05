import Phaser from "phaser";

export default class CafeScene extends Phaser.Scene {
  constructor() {
    super("CafeScene");
  }

  // -----------------------------
  // ORDER UI
  // -----------------------------
  updateOrderUI() {
    let text = "ORDERS:\n\n";

    for (const table of this.tables) {

        const customer = this.customers.find(c => c.table === table);

        if (customer) {
            text += `Table ${table.number}: ${customer.order ?? "NO ORDER"} (${customer.state})\n`;
        } else {
            text += `Table ${table.number}: Empty\n`;
        }
    }

    this.orderText.setText(text);
}

  updateKeyHelp() {
    this.keyHelp.setText(
`FOOD CONTROLS:

1 cake_strawberry
2 matcha_latte
3 coffee
4 latte_regular
5 cappucino
6 tea
7 iced_coffee
8 lemonade
9 cocoa
0 strawberry_milkshake

Q cinnamon_latte
W cinnamon_roll
E macaron
R chocolate_muffin
T pudding

F = take order
SPACE = serve
X = clear item`
    );
  }

  // -----------------------------
  // CREATE
  // -----------------------------
  create() {
    const TILE = 32;

    

    this.physics.world.setBounds(0, 0, 1200, 900);

    this.add.rectangle(600, 450, 1200, 900, 0xf6efe6);

    // INPUT
    this.cursors = this.input.keyboard.createCursorKeys();

    this.keys = this.input.keyboard.addKeys({
      one: Phaser.Input.Keyboard.KeyCodes.ONE,
      two: Phaser.Input.Keyboard.KeyCodes.TWO,
      three: Phaser.Input.Keyboard.KeyCodes.THREE,
      four: Phaser.Input.Keyboard.KeyCodes.FOUR,
      five: Phaser.Input.Keyboard.KeyCodes.FIVE,
      six: Phaser.Input.Keyboard.KeyCodes.SIX,
      seven: Phaser.Input.Keyboard.KeyCodes.SEVEN,
      eight: Phaser.Input.Keyboard.KeyCodes.EIGHT,
      nine: Phaser.Input.Keyboard.KeyCodes.NINE,
      zero: Phaser.Input.Keyboard.KeyCodes.ZERO,

      q: Phaser.Input.Keyboard.KeyCodes.Q,
      w: Phaser.Input.Keyboard.KeyCodes.W,
      e: Phaser.Input.Keyboard.KeyCodes.E,
      r: Phaser.Input.Keyboard.KeyCodes.R,
      t: Phaser.Input.Keyboard.KeyCodes.T,
      f: Phaser.Input.Keyboard.KeyCodes.F,
      x: Phaser.Input.Keyboard.KeyCodes.X,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE
    });

    // ITEMS
    this.ITEMS = {
      cake_strawberry: "cake_strawberry_1",
      matcha_latte: "matcha_latte_1",
      coffee: "coffee_1",
      latte_regular: "latte_regular_1",
      cappucino: "cappucino_1",
      tea: "tea_1",
      iced_coffee: "iced_coffee_1",
      lemonade: "lemonade_1",
      cocoa: "cocoa_1",
      cinnamon_latte: "cinnamon_latte_1",
      cinnamon_roll: "cinnamon_roll_1",
      macaron: "macaron_1",
      chocolate_muffin: "chocolate_muffin_1",
      pudding: "pudding_1",
      strawberry_milkshake: "strawberry_milkshake_1"
    };

    // PLAYER
    this.player = this.physics.add.sprite(300, 300, "player_1");
    this.player.setScale(0.45);
    this.player.setDepth(10);

    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
    this.cameras.main.setZoom(1);
    this.cameras.main.setBounds(-200, 20, -200, 20);

    this.anims.create({
    key: "player_walk",
    frames: [
        { key: "player_1" },
        { key: "player_2" },
        { key: "player_3" }
    ],
    frameRate: 8,
    repeat: -1
});

    // UI
    this.orderText = this.add.text(10, 10, "ORDERS:\n", {
  fontFamily: "Arial",
  fontSize: "12px",
  color: "#000",
  backgroundColor: "#ffffff",
  padding: { x: 6, y: 6 }
})
.setScrollFactor(0)
.setDepth(1000);

this.keyHelp = this.add.text(10, 110, "", {
  fontFamily: "Arial",
  fontSize: "11px",
  color: "#000",
  backgroundColor: "#ffffff",
  padding: { x: 6, y: 6 }
})
.setScrollFactor(0)
.setDepth(1000);

    this.keyHelp = this.add.text(20, 140, "", {
      fontFamily: "Arial",
      fontSize: "14px",
      color: "#000",
      backgroundColor: "#ffffff",
      padding: { x: 10, y: 10 }
    }).setScrollFactor(0).setDepth(1000);

    this.updateKeyHelp();

    // TABLES
    this.tables = [];
    const layout = [
      { x: 8, y: 6 },
      { x: 11, y: 6 },
      { x: 8, y: 9 },
      { x: 11, y: 9 }
    ];
    layout.forEach((pos, index) => {
      const x = pos.x * TILE;
      const y = pos.y * TILE;

      this.add.image(x, y + 33, "table_1")
        .setDisplaySize(140, 140)
        .setDepth(3);

      this.add.image(x, y + 20, "chair_1")
        .setDisplaySize(100, 100)
        .setDepth(1);

      this.tables.push({
    number: index + 1,
    x,
    seatX: x,
    seatY: y + 5,
    foodX: x,
    foodY: y + 10,
    occupied: false,
    foodSprite: null
});
    });

    this.customers = [];

    this.time.addEvent({
      delay: 2500,
      loop: true,
      callback: () => this.spawnCustomer()
    });

    this.heldItem = null;
    this.heldSprite = null;
  }

  // -----------------------------
  // CUSTOMER SPAWN
  // -----------------------------
  spawnCustomer() {
    const table = this.tables.find(t => !t.occupied);
    if (!table) return;

    table.occupied = true;

    const customerTypes = [
  { walk: "customer1", sit: "customerSit1" },
  { walk: "customer2", sit: "customerSit2" },
  { walk: "customer3", sit: "customerSit3" },
  { walk: "customer4", sit: "customerSit4" },
  { walk: "customer5", sit: "customerSit5" },
  { walk: "customer6", sit: "customerSit6" },
  { walk: "customer7", sit: "customerSit7" },
  { walk: "customer8", sit: "customerSit8" }
];

const type = Phaser.Utils.Array.GetRandom(customerTypes);

const sprite = this.physics.add.sprite(100, 100, type.walk);
sprite.setScale(0.33);

this.customers.push({
  sprite,
  sitTexture: type.sit,
  table,
  state: "walking",
  targetX: table.seatX,
  targetY: table.seatY,
  order: null,
  exitX: -100
});
    sprite.setDepth(2);
  }

  // -----------------------------
  // ORDER SYSTEM
  // -----------------------------
  tryTakeOrder() {
    for (let c of this.customers) {
      if (c.state !== "waitingToOrder") continue;

      const d = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        c.sprite.x,
        c.sprite.y
      );

      if (d < 70) {
        c.state = "waitingForFood";

        // ✅ FIX: only assign ONCE
        if (!c.order) {
          const items = Object.keys(this.ITEMS);
          c.order = items[Phaser.Math.Between(0, items.length - 1)];
        }

        break;
      }
    }
  }

  serveFood() {
    if (!this.heldItem) return;

    for (let c of this.customers) {
      if (c.state !== "waitingForFood") continue;

      const d = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        c.sprite.x,
        c.sprite.y
      );

      if (d < 70) {
        if (this.heldItem !== c.order) return;

        const t = c.table;

        if (t.foodSprite) t.foodSprite.destroy();

        t.foodSprite = this.add.image(
    t.foodX,
    t.foodY,
    this.ITEMS[this.heldItem]
);

if (this.heldItem === "cake_strawberry" || this.heldItem === "matcha_latte") {
    t.foodSprite.setScale(0.17);
} else {
    t.foodSprite.setScale(0.28);
}

t.foodSprite.setDepth(4);
        this.clearHeldItem();

        c.state = "eating";

        this.time.delayedCall(1500, () => {
          t.foodSprite?.destroy();
          c.state = "leaving";
        });

        t.foodSprite.setDepth(4);

        break;
      }
    }
  }

  // -----------------------------
  // UPDATE LOOP
  // -----------------------------
  update() {
    const speed = 200;

    this.player.setVelocity(0);

    if (this.cursors.left.isDown) this.player.setVelocityX(-speed);
    else if (this.cursors.right.isDown) this.player.setVelocityX(speed);

    if (this.cursors.up.isDown) this.player.setVelocityY(-speed);
    else if (this.cursors.down.isDown) this.player.setVelocityY(speed);

    // ✅ FIXED INPUT (reliable)
    // FOOD ITEM KEYS (IMPORTANT FIX)
if (Phaser.Input.Keyboard.JustDown(this.keys.one)) this.equipItem("cake_strawberry");
if (Phaser.Input.Keyboard.JustDown(this.keys.two)) this.equipItem("matcha_latte");
if (Phaser.Input.Keyboard.JustDown(this.keys.three)) this.equipItem("coffee");
if (Phaser.Input.Keyboard.JustDown(this.keys.four)) this.equipItem("latte_regular");
if (Phaser.Input.Keyboard.JustDown(this.keys.five)) this.equipItem("cappucino");
if (Phaser.Input.Keyboard.JustDown(this.keys.six)) this.equipItem("tea");
if (Phaser.Input.Keyboard.JustDown(this.keys.seven)) this.equipItem("iced_coffee");
if (Phaser.Input.Keyboard.JustDown(this.keys.eight)) this.equipItem("lemonade");
if (Phaser.Input.Keyboard.JustDown(this.keys.nine)) this.equipItem("cocoa");
if (Phaser.Input.Keyboard.JustDown(this.keys.zero)) this.equipItem("strawberry_milkshake");

if (Phaser.Input.Keyboard.JustDown(this.keys.q)) this.equipItem("cinnamon_latte");
if (Phaser.Input.Keyboard.JustDown(this.keys.w)) this.equipItem("cinnamon_roll");
if (Phaser.Input.Keyboard.JustDown(this.keys.e)) this.equipItem("macaron");
if (Phaser.Input.Keyboard.JustDown(this.keys.r)) this.equipItem("chocolate_muffin");
if (Phaser.Input.Keyboard.JustDown(this.keys.t)) this.equipItem("pudding");
if (Phaser.Input.Keyboard.JustDown(this.keys.space)) {
  this.serveFood();
}
if (Phaser.Input.Keyboard.JustDown(this.keys.f)) {
  this.tryTakeOrder();
}



    // ✅ FIXED ANIMATION
    const moving =
    this.player.body.velocity.x !== 0 ||
    this.player.body.velocity.y !== 0;

if (moving) {
    this.player.anims.play("player_walk", true);
} else {
    this.player.anims.stop();
    this.player.setTexture("player_1");
}
    if (Phaser.Input.Keyboard.JustDown(this.keys.x)) {
      this.clearHeldItem();
    }

    if (this.heldSprite) {
      const b = this.player.getBounds();
      this.heldSprite.setPosition(this.player.x, b.y + b.height * 0.5);
    }

    this.updateCustomers();
    this.updateOrderUI();
  }

  // -----------------------------
  // CUSTOMERS
  // -----------------------------
  updateCustomers() {
    for (let c of this.customers) {
      if (!c.sprite.active) continue;

      if (c.state === "walking") {
        const dx = c.targetX - c.sprite.x;
        const dy = c.targetY - c.sprite.y;
        const dist = Math.hypot(dx, dy);

        if (dist > 2) {
          c.sprite.setVelocity((dx / dist) * 120, (dy / dist) * 120);
        } else {
          c.sprite.setVelocity(0, 0);
          c.sprite.setTexture(c.sitTexture);

          c.state = "waitingToOrder";

          // (NO ORDER RANDOMIZATION HERE ANYMORE)
        }
      }

      if (c.state === "leaving") {
        c.sprite.setVelocity(-120, 0);

        if (c.sprite.x < c.exitX) {
          c.table.occupied = false;
          c.sprite.destroy();
          this.customers = this.customers.filter(x => x !== c);
        }
      }
    }
  }

  // -----------------------------
  // ITEM HANDLING
  // -----------------------------
  equipItem(item) {
  this.heldItem = item;

  if (this.heldSprite) this.heldSprite.destroy();

  this.heldSprite = this.add.image(
    this.player.x,
    this.player.y,
    this.ITEMS[item]
  );

  // Keep cake and matcha the same size
  if (item === "cake_strawberry" || item === "matcha_latte") {
    this.heldSprite.setScale(0.17);
  } else {
    this.heldSprite.setScale(0.28); // make every other food larger
  }

  this.heldSprite.setDepth(11);
}

  clearHeldItem() {
    this.heldItem = null;
    this.heldSprite?.destroy();
    this.heldSprite = null;
  }
}
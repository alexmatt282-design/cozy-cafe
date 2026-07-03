import Phaser from "phaser";

export default class CafeScene extends Phaser.Scene {
  constructor() {
    super("CafeScene");
  }

  updateOrderUI() {
    let text = "ORDERS:\n\n";

    for (let i = 0; i < this.customers.length; i++) {
      const c = this.customers[i];
      if (!c || !c.table) continue;

      if (c.state === "waitingForFood" || c.state === "eating") {
        text += `Table ${i + 1}: ${c.order || "..." }\n`;
      }
    }

    this.orderText.setText(text);
  }

  updateKeyHelp() {
    this.keyHelp.setText(
`FOOD CONTROLS:

1  cake_strawberry
2  matcha_latte
3  coffee
4  latte_regular
5  cappucino
6  tea
7  iced_coffee
8  lemonade
9  cocoa
0  strawberry_milkshake

Q  cinnamon_latte
W  cinnamon_roll
E  macaron
R  chocolate_muffin
T  pudding

F = take order
SPACE = serve
X = cancel item`
    );
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

    // ITEM MAP
    this.ITEMS = {
      cake_strawberry: "cake_strawberry_1",
      matcha_latte: "matcha_latte_1",

      cinnamon_latte: "cinnamon_latte_1",
      strawberry_milkshake: "strawberry_milkshake_1",
      tea: "tea_1",
      latte_regular: "latte_regular_1",
      coffee: "coffee_1",
      iced_coffee: "iced_coffee_1",
      lemonade: "lemonade_1",
      cocoa: "cocoa_1",
      cinnamon_roll: "cinnamon_roll_1",
      macaron: "macaron_1",
      chocolate_muffin: "chocolate_muffin_1",
      pudding: "pudding_1",
      cappucino: "cappucino_1"
    };

    // BASE SCALE SYSTEM
    this.ITEM_SCALE = {
      cake_strawberry: 0.10,
      matcha_latte: 0.10,
      default: 0.18,
      cappucino: 0.16
    };

    // PLAYER
    this.player = this.physics.add.sprite(300, 300, "player_1");
    this.player.setScale(0.24);
    this.player.setOrigin(0.5, 1);
    this.player.setDepth(10);

    this.cameras.main.startFollow(this.player);

    // UI
    this.orderText = this.add.text(20, 20, "ORDERS:\n", {
      fontSize: "16px",
      fill: "#000",
      backgroundColor: "#ffffff",
      padding: { x: 10, y: 8 }
    });

    this.orderText.setScrollFactor(0);
    this.orderText.setDepth(999);

    this.keyHelp = this.add.text(20, 120, "", {
      fontSize: "14px",
      fill: "#000",
      backgroundColor: "#ffffff",
      padding: { x: 10, y: 8 }
    });

    this.keyHelp.setScrollFactor(0);
    this.keyHelp.setDepth(999);

    this.updateKeyHelp();

    this.heldItem = null;
    this.heldSprite = null;

    this.walkFrame = 1;
    this.walkTimer = 0;

    // TABLES
    this.tables = [];

    const layout = [
      { x: 8, y: 6 },
      { x: 11, y: 6 },
      { x: 8, y: 9 },
      { x: 11, y: 9 }
    ];

    layout.forEach(pos => {
      const x = pos.x * TILE;
      const y = pos.y * TILE;

      this.add.image(x, y + 33, "table_1")
        .setDisplaySize(76, 76)
        .setOrigin(0.5, 1)
        .setDepth(3);

      this.add.image(x, y + 20, "chair_1")
        .setDisplaySize(58, 58)
        .setOrigin(0.5, 1)
        .setDepth(2);

      this.tables.push({
        x,
        seatX: x,
        seatY: y + 20,
        foodX: x,
        foodY: y - 15,
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
  }

  spawnCustomer() {
    const types = [
      "customer1","customer2","customer3",
      "customer4","customer5","customer6",
      "customer7","customer8"
    ];

    const sitTypes = [
      "customerSit1","customerSit2","customerSit3",
      "customerSit4","customerSit5","customerSit6",
      "customerSit7","customerSit8"
    ];

    const table = this.tables.find(t => !t.occupied);
    if (!table) return;

    table.occupied = true;

    const index = Phaser.Math.Between(0, types.length - 1);

    const sprite = this.physics.add.sprite(
      100,
      100 + this.customers.length * 40,
      types[index]
    );

    sprite.setScale(0.17);
    sprite.setOrigin(0.5, 1);
    sprite.setDepth(2);

    this.customers.push({
      sprite,
      sitTexture: sitTypes[index],
      walkTexture: types[index],
      table,
      state: "walking",
      targetX: table.seatX,
      targetY: table.seatY,
      order: null,
      exitX: -50
    });
  }

  update() {
    const speed = 200;

    this.player.setVelocity(0);

    let moving = false;

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-speed);
      moving = true;
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(speed);
      moving = true;
    }

    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-speed);
      moving = true;
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(speed);
      moving = true;
    }

    if (moving) {
      this.walkTimer++;
      if (this.walkTimer > 8) {
        this.walkTimer = 0;
        this.walkFrame++;
        if (this.walkFrame > 3) this.walkFrame = 1;
        this.player.setTexture(`player_${this.walkFrame}`);
      }
    } else {
      this.walkFrame = 1;
      this.player.setTexture("player_1");
    }

    const bind = (key, item) => {
      if (Phaser.Input.Keyboard.JustDown(this.keys[key])) {
        this.equipItem(item);
      }
    };

    bind("one","cake_strawberry");
    bind("two","matcha_latte");
    bind("three","coffee");
    bind("four","latte_regular");
    bind("five","cappucino");
    bind("six","tea");
    bind("seven","iced_coffee");
    bind("eight","lemonade");
    bind("nine","cocoa");
    bind("zero","strawberry_milkshake");
    bind("q","cinnamon_latte");
    bind("w","cinnamon_roll");
    bind("e","macaron");
    bind("r","chocolate_muffin");
    bind("t","pudding");

    if (Phaser.Input.Keyboard.JustDown(this.keys.x)) {
      this.clearHeldItem();
    }

    if (Phaser.Input.Keyboard.JustDown(this.keys.f)) {
      this.tryTakeOrder();
    }

    if (Phaser.Input.Keyboard.JustDown(this.keys.space)) {
      this.serveFood();
    }

    if (this.heldSprite) {
      const b = this.player.getBounds();
      this.heldSprite.setPosition(this.player.x, b.y + b.height * 0.5);
    }

    this.updateCustomers();
    this.updateOrderUI();
  }

  equipItem(item) {
    const texture = this.ITEMS[item];
    if (!texture) return;

    this.heldItem = item;

    if (this.heldSprite) this.heldSprite.destroy();

    this.heldSprite = this.add.image(this.player.x, this.player.y, texture);

    const scale = this.ITEM_SCALE[item] ?? this.ITEM_SCALE.default;
    this.heldSprite.setScale(scale);
    this.heldSprite.setDepth(11);
  }

  clearHeldItem() {
    this.heldItem = null;
    if (this.heldSprite) this.heldSprite.destroy();
    this.heldSprite = null;
  }

  tryTakeOrder() {
    for (let c of this.customers) {
      if (c.state !== "waitingToOrder") continue;

      const d = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        c.sprite.x,
        c.sprite.y
      );

      if (d < 60) {
        c.state = "ordering";

        this.time.delayedCall(600, () => {
          const items = Object.keys(this.ITEMS);
          c.order = items[Phaser.Math.Between(0, items.length - 1)];
          c.state = "waitingForFood";
        });

        break;
      }
    }
  }

  serveFood() {
    if (!this.heldItem) return;

    for (let c of this.customers) {
      if (!c || !c.sprite || !c.sprite.active) continue;

      const d = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        c.sprite.x,
        c.sprite.y
      );

      if (d < 60 && (c.state === "waitingForFood" || c.state === "waitingToOrder")) {
        const t = c.table;

        if (t.foodSprite) t.foodSprite.destroy();

        const tex = this.ITEMS[this.heldItem];
        if (!tex) return;

        t.foodSprite = this.add.image(t.foodX, t.foodY, tex);

        const scale = this.ITEM_SCALE[this.heldItem] ?? this.ITEM_SCALE.default;
        t.foodSprite.setScale(scale);
        t.foodSprite.setDepth(4);

        this.clearHeldItem();

        c.state = "eating";

        this.time.delayedCall(2000, () => {
          if (t.foodSprite) t.foodSprite.destroy();
          c.sprite.setTexture(c.walkTexture);
          c.state = "leaving";
        });

        break;
      }
    }
  }

  updateCustomers() {
    for (let c of this.customers) {
      if (!c || !c.sprite || !c.sprite.active) continue;

      if (c.state === "walking") {
        const dx = c.targetX - c.sprite.x;
        const dy = c.targetY - c.sprite.y;
        const dist = Math.hypot(dx, dy);

        if (dist > 2) {
          c.sprite.setVelocity((dx / dist) * 120, (dy / dist) * 120);
        } else {
          c.sprite.setVelocity(0, 0);
          c.state = "waitingToOrder";
          c.sprite.setTexture(c.sitTexture);
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
}
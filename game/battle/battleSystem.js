var BattleScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

        function BattleScene() {
            Phaser.Scene.call(this, {key: 'BattleScene'});
        },
    create: function () {
        // change the background to green
        this.cameras.main.setBackgroundColor("rgba(0, 200, 0, 0.5)");
        this.startBattle();
        // on wake event we call startBattle too
        this.sys.events.on('wake', this.startBattle, this);
    },
    endBattle: function (end) {
        // clear state, remove sprites
        this.heroes.length = 0;
        this.enemies.length = 0;
        for (var i = 0; i < this.units.length; i++) {
            // link item
            this.units[i].destroy();
        }
        this.units.length = 0;
        // sleep the UI

        // return to WorldScene and sleep current BattleScene
        if (end.victory) {

            this.scene.sleep('UIScene');

            this.scene.switch('InitialMap');
        } else {
            this.events.emit("Message", "Game Over");
            this.time.addEvent({
                delay: 2000, callback: function () {
                    this.scene.sleep('UIScene');
                    this.scene.switch('BootScene');
                }, callbackScope: this
            });
            //this.scene.switch('BootScene');
        }
    },
    startBattle: function () {
        // player character - warrior
        var warrior = new PlayerCharacter(this, 250, 50, "player", 1, "Warrior", 100, 20, 0.3, 8, 20);
        this.add.existing(warrior);

        // player character - mage
        var mage = new PlayerCharacter(this, 250, 100, "player", 4, "Mage", 80, 8, 0.1, 2, 5);
        this.add.existing(mage);

        var dragonblue = new Enemy(this, 50, 50, "dragonblue", null, "Dragon", 50, 23, 0.4, 8, 15);
        this.add.existing(dragonblue);

        var dragonOrange = new Enemy(this, 50, 100, "dragonorrange", null, "Dragon2", 50, 35, 0.35, 11, 5);
        this.add.existing(dragonOrange);

        // array with heroes
        this.heroes = [warrior, mage];
        // array with enemies
        this.enemies = [dragonblue, dragonOrange];
        // array with both parties, who will attack
        this.units = this.heroes.concat(this.enemies);

        this.index = -1; // currently active unit

        this.scene.run("UIScene");
    },
    checkEndBattle: function () {
        var victory = true;
        // if all enemies are dead we have victory
        for (var i = 0; i < this.enemies.length; i++) {
            if (this.enemies[i].living)
                victory = false;
        }
        var gameOver = true;
        // if all heroes are dead we have game over
        for (var i = 0; i < this.heroes.length; i++) {
            if (this.heroes[i].living)
                gameOver = false;
        }
        return {victory: victory, gameOver: gameOver};
    },
    nextTurn: function () {
        // if we have victory or game over
        var end = this.checkEndBattle();

        if (end.victory || end.gameOver) {
            this.endBattle(end);
            return;
        }
        do {
            // currently active unit
            this.index++;
            // if there are no more units, we start again from the first one
            if (this.index >= this.units.length) {
                this.index = 0;
            }
        } while (!this.units[this.index].living);
        // if its player hero
        if (this.units[this.index] instanceof PlayerCharacter) {
            // we need the player to select action and then enemy
            this.events.emit("PlayerSelect", this.index);
        } else { // else if its enemy unit
            // pick random living hero to be attacked
            var r;
            do {
                r = Math.floor(Math.random() * this.heroes.length);
            } while (!this.heroes[r].living)
            // call the enemy's attack function
            this.units[this.index].attack(this.heroes[r]);
            // add timer for the next turn, so will have smooth gameplay
            this.time.addEvent({delay: 3000, callback: this.nextTurn, callbackScope: this});
        }

        this.scene.get('UIScene').remapHeroes();
    },
    receivePlayerSelection: function (action, target) {
        if (action === 'attack') {
            this.units[this.index].attack(this.enemies[target]);
        }
        this.time.addEvent({delay: 3000, callback: this.nextTurn, callbackScope: this});
    }
});

var UIScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

        function UIScene() {
            Phaser.Scene.call(this, {key: 'UIScene'});
        },

    init: function () {
        this.battleScene = this.scene.get("BattleScene");
        // when its player cunit turn to move
        this.battleScene.events.on("PlayerSelect", this.onPlayerSelect, this);
        // the message describing the current action

        this.message = new Message(this, this.battleScene.events);
        this.add.existing(this.message);
    },
    create: function () {
        // draw some background for the menu
        this.graphics = this.add.graphics();
        this.graphics.lineStyle(1, 0xffffff);
        this.graphics.fillStyle(0x031f4c, 1);
        this.graphics.strokeRect(2, 150, 90, 100);
        this.graphics.fillRect(2, 150, 90, 100);
        this.graphics.strokeRect(95, 150, 90, 100);
        this.graphics.fillRect(95, 150, 90, 100);
        this.graphics.strokeRect(188, 150, 130, 100);
        this.graphics.fillRect(188, 150, 130, 100);

        // basic container to hold all menus
        this.menus = this.add.container();

        this.heroesMenu = new HeroesMenu(195, 153, this);
        this.actionsMenu = new ActionsMenu(100, 153, this);
        this.enemiesMenu = new EnemiesMenu(8, 153, this);

        // the currently selected menu
        this.currentMenu = this.actionsMenu;
        // add menus to the container
        this.menus.add(this.heroesMenu);
        this.menus.add(this.actionsMenu);
        this.menus.add(this.enemiesMenu);


        // listen for keyboard events
        this.input.keyboard.on("keydown", this.onKeyInput, this);

        // when the action on the menu is selected
        // for now we have only one action so we dont send and action id
        this.events.on("SelectedAction", this.onSelectedAction, this);

        // an enemy is selected
        this.events.on("Enemy", this.onEnemy, this);

        // when the scene receives wake event
        this.sys.events.on('wake', this.createMenu, this);

        this.createMenu();
    }, remapHeroes: function () {
        var heroes = this.battleScene.heroes;
        this.heroesMenu.remap(heroes);

    },
    createMenu: function () {
        // map hero menu items to heroes
        this.remapHeroes();
        // map enemies menu items to enemies
        this.remapEnemies();
        // first move
        this.battleScene.nextTurn();
    },
    remapEnemies: function () {
        var enemies = this.battleScene.enemies;
        this.enemiesMenu.remap(enemies);
    },
    onKeyInput: function (event) {
        if (this.currentMenu) {
            if (event.code === "ArrowUp") {
                this.currentMenu.moveSelectionUp();
            } else if (event.code === "ArrowDown") {
                this.currentMenu.moveSelectionDown();
            } else if (event.code === "ArrowRight" || event.code === "Shift") {

            } else if (event.code === "Space" || event.code === "ArrowLeft") {
                this.currentMenu.confirm();
            }
        }
    },
    onEnemy: function (index) {
        this.heroesMenu.deselect();
        this.actionsMenu.deselect();
        this.enemiesMenu.deselect();
        this.currentMenu = null;
        this.battleScene.receivePlayerSelection('attack', index);
    },
    onSelectedAction: function () {
        this.currentMenu = this.enemiesMenu;
        this.enemiesMenu.select(0);
    },
    onPlayerSelect: function (id) {
        this.heroesMenu.select(id);
        console.log(this.heroesMenu);
        this.actionsMenu.select(0);
        this.currentMenu = this.actionsMenu;
    }
});

var MenuItem = new Phaser.Class({
    Extends: Phaser.GameObjects.Text,

    initialize:

        function MenuItem(x, y, text, scene) {
            Phaser.GameObjects.Text.call(this, scene, x, y, text, {color: '#ffffff', align: 'left', fontSize: 15});
        },

    select: function () {
        this.setColor('#f8ff38');
    },

    deselect: function () {
        this.setColor('#ffffff');
    },
    unitKilled: function () {
        this.active = false;
        this.visible = false;
    }

});

var StatusText = new Phaser.Class({
    Extends: Phaser.GameObjects.Text,

    initialize:

        function StatusText(x, y, text, scene) {
            Phaser.GameObjects.Text.call(this, scene, x, y, text, {color: '#ffffff', align: 'right', fontSize: 15});
        },

    warn: function () {
        this.setColor('#f8ff38');
    },
    ko: function () {
        this.setColor('#ff2e22');
    }

});

var Menu = new Phaser.Class({
    Extends: Phaser.GameObjects.Container,

    initialize:

        function Menu(x, y, scene, heroes) {
            Phaser.GameObjects.Container.call(this, scene, x, y);
            this.menuItems = [];
            this.statusItems = [];
            this.menuItemIndex = 0;
            this.heroes = heroes;
            this.x = x;
            this.y = y;
        },
    addMenuItem: function (unit) {
        var menuItem = new MenuItem(0, this.menuItems.length * 20, unit, this.scene);
        menuItem.setInteractive();
        menuItem.on('pointerdown', function (pointer, localX, localY, event) {
            if(this instanceof ActionsMenu)
                this.scene.events.emit("SelectedAction");
            else if(this instanceof EnemiesMenu)
                this.scene.events.emit('Enemy', this);
        }, this);
        this.menuItems.push(menuItem);
        this.add(menuItem);
        return menuItem;
    },
    addText: function (unit) {
        if (unit instanceof Enemy)
            return;
        var statusItem = null;
        if (this.textItem === undefined) {
            statusItem = new StatusText(70, this.statusItems.length * 20, unit.hp + "/" + unit.maxHp, this.scene);
            statusItem.setScale(0.9);
            this.statusItems.push(statusItem);
            this.add(statusItem);
        } else {
            statusItem = this.textItem;
            statusItem.setText(unit.hp + "/" + unit.maxHp);
        }
        var perc = unit.hp / unit.maxHp;
        if (perc <= 0.5 && perc > 0) {
            statusItem.warn();
        } else if (perc === 0) {
            statusItem.ko();
        }
        return statusItem;
    },
    moveSelectionUp: function () {
        this.menuItems[this.menuItemIndex].deselect();
        do {
            this.menuItemIndex--;
            if (this.menuItemIndex < 0)
                this.menuItemIndex = this.menuItems.length - 1;
        } while (!this.menuItems[this.menuItemIndex].active);
        this.menuItems[this.menuItemIndex].select();
    },
    moveSelectionDown: function () {
        this.menuItems[this.menuItemIndex].deselect();
        do {
            this.menuItemIndex++;
            if (this.menuItemIndex >= this.menuItems.length)
                this.menuItemIndex = 0;
        } while (!this.menuItems[this.menuItemIndex].active);
        this.menuItems[this.menuItemIndex].select();
    },
    // select the menu as a whole and an element with index from it
    select: function (index) {
        if (!index)
            index = 0;
        this.menuItems[this.menuItemIndex].deselect();
        this.menuItemIndex = index;
        while (!this.menuItems[this.menuItemIndex].active) {
            this.menuItemIndex++;
            if (this.menuItemIndex >= this.menuItems.length)
                this.menuItemIndex = 0;
            if (this.menuItemIndex === index)
                return;
        }
        this.menuItems[this.menuItemIndex].select();
        this.selected = true;
    },
    // deselect this menu
    deselect: function () {
        this.menuItems[this.menuItemIndex].deselect();
        this.menuItemIndex = 0;
    },
    confirm: function () {
        // wen the player confirms his selection, do the action
    },
    clear: function () {
        for (var i = 0; i < this.menuItems.length; i++) {
            this.menuItems[i].destroy();
            if (this.statusItems[i])
                this.statusItems[i].destroy();
        }
        this.menuItems.length = 0;
        this.statusItems.length = 0;
        //this.menuItemIndex = 0;
    },
    remap: function (units) {
        this.clear();

        for (var i = 0; i < units.length; i++) {
            var unit = units[i];
            unit.setMenuItem(this.addMenuItem(unit.type));
            if (unit instanceof PlayerCharacter)
                unit.setTextItem(this.addText(unit));
        }
        units[this.menuItemIndex].menuItem.select();
        this.menuItemIndex = 0;
    }
});

var HeroesMenu = new Phaser.Class({
    Extends: Menu,

    initialize:

        function HeroesMenu(x, y, scene) {
            Menu.call(this, x, y, scene);
        }
});

var ActionsMenu = new Phaser.Class({
        Extends: Menu,

        initialize:

            function ActionsMenu(x, y, scene) {
                Menu.call(this, x, y, scene);
                this.addMenuItem('Attack');


            },
        confirm:

            function () {
                this.scene.events.emit("SelectedAction");
            }

    })
;


var EnemiesMenu = new Phaser.Class({
    Extends: Menu,

    initialize:

        function EnemiesMenu(x, y, scene) {
            Menu.call(this, x, y, scene);
        },
    confirm: function () {
        this.scene.events.emit("Enemy", this.menuItemIndex);
    }
});

var Message = new Phaser.Class({

    Extends: Phaser.GameObjects.Container,

    initialize:
        function Message(scene) {

            var events = scene.scene.get('BattleScene').events;
            Phaser.GameObjects.Container.call(this, scene, 160, 30);
            var graphics = this.scene.add.graphics();
            this.add(graphics);
            graphics.lineStyle(1, 0xffffff, 0.8);
            graphics.fillStyle(0x031f4c, 0.3);
            graphics.strokeRect(-90, -15, 180, 30);
            graphics.fillRect(-90, -15, 180, 30);
            this.text = new Phaser.GameObjects.Text(scene, 0, 0, "", {
                color: '#ffffff',
                align: 'center',
                fontSize: 13,
                wordWrap: {width: 160, useAdvancedWrap: true}
            });
            this.add(this.text);
            this.text.setOrigin(0.5);
            events.on("Message", this.showMessage, this);
            this.visible = false;
        },
    showMessage: function (text) {
        this.text.setText(text);
        this.visible = true;
        if (this.hideEvent)
            this.hideEvent.remove(false);
        this.hideEvent = this.scene.time.addEvent({delay: 2000, callback: this.hideMessage, callbackScope: this});
    },
    hideMessage: function () {
        this.hideEvent = null;
        this.visible = false;
    }
});
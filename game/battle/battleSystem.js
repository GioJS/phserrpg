var BattleScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

        function BattleScene() {
            Phaser.Scene.call(this, {key: 'BattleScene'});
        },
    create: function () {
        // change the background to green
        this.cameras.main.setBackgroundColor('rgba(0, 200, 0, 0.5)');

        // player character - warrior
        var warrior = new PlayerCharacter(this, 250, 50, 'player', 1, 'Warrior', 100, 50);
        this.add.existing(warrior);

        // player character - mage
        var mage = new PlayerCharacter(this, 250, 100, 'player', 4, 'Mage', 80, 50);
        this.add.existing(mage);

        var dragonblue = new Enemy(this, 50, 50, 'dragonblue', null, 'Dragon', 50, 13);
        this.add.existing(dragonblue);

        var dragonOrange = new Enemy(this, 50, 100, 'dragonorrange', null, 'Dragon2', 50, 10);
        this.add.existing(dragonOrange);

        // array with heroes
        this.heroes = [warrior, mage];
        // array with enemies
        this.enemies = [dragonblue, dragonOrange];
        // array with both parties, who will attack
        this.units = this.heroes.concat(this.enemies);

        // Run UI Scene at the same time
        this.scene.launch('UIScene');
        this.index = -1;
    },
    nextTurn: function () {
        this.index++;
        this.unitDead();
        if (this.checkWin(2)) {
            this.scene.stop('UIScene');
            this.scene.start('InitialMap');
        }

        if (this.checkLose(2)) {
            this.scene.stop('UIScene');
            this.scene.start('BootScene')
        }
        // if there are no more units, we start again from the first one
        if (this.index >= this.units.length) {
            this.index = 0;
        }
        if (this.units[this.index]) {
            // if its player hero
            if (this.units[this.index] instanceof PlayerCharacter) {
                if (this.units[this.index].isAlive)
                    this.events.emit('PlayerSelect', this.index);
            } else { // else if its enemy unit
                // pick random hero
                if (this.units[this.index].isAlive) {
                    var r = Math.floor(Math.random() * this.heroes.length);
                    // call the enemy's attack function
                    this.units[this.index].attack(this.heroes[r]);
                    // add timer for the next turn, so will have smooth gameplay
                    this.time.addEvent({delay: 3000, callback: this.nextTurn, callbackScope: this});
                }
            }
        }


    },
    unitDead: function () {
        this.units.forEach(function (unit) {
            if(unit instanceof  PlayerCharacter && !unit.isAlive){
                unit.angle = 90;
            }

            if(unit instanceof  Enemy && !unit.isAlive && unit.scene){

                unit.scene.tweens.add({
                    targets: [unit],
                    alpha: 0,
                    duration: 5000,
                    ease: 'Linear.None',
                    repeat: 0,
                    yoyo: false,
                    onComplete: function () {
                        unit.destroy();
                    },
                    onCompleteScope: this
                });
            }
        });
    },
    checkWin: function (enemy_size) {
        return this.units.filter(function (unit) {
            if (unit instanceof Enemy && !unit.isAlive) {
                return unit;
            }
        }).length === enemy_size;
    },
    checkLose: function (team_size) {
        return this.units.filter(function (unit) {
            if (unit instanceof PlayerCharacter && !unit.isAlive) {
                return unit;
            }
        }).length === team_size;
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
    init: function() {
        this.battleScene = this.scene.get('BattleScene');
        this.message = new Message(this);
        this.add.existing(this.message);
    },
    create: function () {


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

        this.remapHeroes();
        this.remapEnemies();


        this.input.keyboard.on('keydown', this.onKeyInput, this);
        this.battleScene.events.on("PlayerSelect", this.onPlayerSelect, this);
        this.events.on("SelectEnemies", this.onSelectEnemies, this);
        this.events.on("Enemy", this.onEnemy, this);

        this.battleScene.nextTurn();
    }, remapHeroes: function () {
        var heroes = this.battleScene.heroes;
        this.heroesMenu.remap(heroes);
    },
    close: function() {
        this.scene.launch('NoScene');
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
    onSelectEnemies: function () {
        this.currentMenu = this.enemiesMenu;
        this.enemiesMenu.select(0);
    },
    onPlayerSelect: function (id) {
        this.heroesMenu.select(id);
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
    }

});

var Menu = new Phaser.Class({
    Extends: Phaser.GameObjects.Container,

    initialize:

        function Menu(x, y, scene, heroes) {
            Phaser.GameObjects.Container.call(this, scene, x, y);
            this.menuItems = [];
            this.menuItemIndex = 0;
            this.heroes = heroes;
            this.x = x;
            this.y = y;
        },
    addMenuItem: function (unit) {
        var menuItem = new MenuItem(0, this.menuItems.length * 20, unit, this.scene);
        this.menuItems.push(menuItem);
        this.add(menuItem);
    },
    moveSelectionUp: function () {
        this.menuItems[this.menuItemIndex].deselect();
        this.menuItemIndex--;
        if (this.menuItemIndex < 0)
            this.menuItemIndex = this.menuItems.length - 1;
        this.menuItems[this.menuItemIndex].select();
    },
    moveSelectionDown: function () {
        this.menuItems[this.menuItemIndex].deselect();
        this.menuItemIndex++;
        if (this.menuItemIndex >= this.menuItems.length)
            this.menuItemIndex = 0;
        this.menuItems[this.menuItemIndex].select();
    },
    // select the menu as a whole and an element with index from it
    select: function (index) {
        if (!index)
            index = 0;
        this.menuItems[this.menuItemIndex].deselect();
        this.menuItemIndex = index;
        this.menuItems[this.menuItemIndex].select();
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
        }
        this.menuItems.length = 0;
        this.menuItemIndex = 0;
    },
    remap: function (units) {
        this.clear();
        for (var i = 0; i < units.length; i++) {
            var unit = units[i];
            if (unit.isAlive)
                this.addMenuItem(unit.type);
        }
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
    confirm: function () {
        this.scene.events.emit('SelectEnemies');
    }

});


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
var UsePotion = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

        function UsePotion() {
            Phaser.Scene.call(this, {key: 'UsePotion'});

        },

    preload: function () {

    },

    create: function () {
        this.key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.graphics = this.add.graphics();
        this.graphics.lineStyle(1, 0x000000);
        this.graphics.fillStyle(0xffffff, 1);
        this.graphics.strokeRect(200, 0, 120, 300);
        this.graphics.fillRect(200, 0, 120, 300);

        this.buttons = [];

        this.indices = {potions: null, antitodes: null, megapotions: null, revive: null, back: null};
        this.currInd = 0;

        if (inventory.getPotions() > 0) {
            this.potions = this.add.text(205, 25, "Potion x " + inventory.getPotions());
            this.potions.setColor('#cccf00');
            this.potions.setInteractive();
            this.indices.potions = this.currInd++;
            this.potions.on('pointerdown', function () {
                this.scene.deselectAll();
                this.scene.index = this.scene.indices.potions;
                this.scene.potions.setColor('#cccf00')
            });
            this.buttons.push(this.potions);
        }

        if (inventory.getAntitodes() > 0) {
            this.antitodes = this.add.text(205, 5, "Antitode x " + inventory.getAntitodes());
            this.antitodes.setInteractive();
            this.antitodes.setColor('#000000');
            this.indices['antitodes'] = this.currInd++;
            this.antitodes.on('pointerdown', function () {
                this.scene.deselectAll();
                this.scene.index = this.scene.indices.antitodes;
                this.scene.antitodes.setColor('#cccf00')
            });
            this.buttons.push(this.antitodes);
        }

        if (inventory.getMegapotions() > 0) {
            this.megapotions = this.add.text(205, 45, "Megapotion x " + inventory.getMegapotions());
            this.megapotions.setColor('#000000');
            this.megapotions.setInteractive();
            this.indices['megapotions'] = this.currInd++;
            this.megapotions.on('pointerdown', function () {
                this.scene.deselectAll();
                this.scene.index = this.scene.indices.megapotions;
                this.scene.megapotions.setColor('#cccf00')
            });
            this.buttons.push(this.megapotions);
        }

        if (inventory.getRevives() > 0) {
            this.revives = this.add.text(205, 65, "Revive x " + inventory.getRevives());
            this.revives.setColor('#000000');
            this.revives.setInteractive();
            this.indices['revives'] = this.currInd++;
            this.revives.on('pointerdown', function () {
                this.scene.deselectAll();
                this.scene.index = this.scene.indices.revives;
                this.scene.revives.setColor('#cccf00')
            });
            this.buttons.push(this.revives);
        }

        this.back = this.add.text(205, 85, "Back");
        this.back.setColor('#000000');
        this.back.setInteractive();
        this.indices['back'] = this.currInd++;
        this.back.on('pointerdown', function () {
            this.scene.deselectAll();
            if (this.scene.index === this.scene.indices.back)
                this.scene.scene.switch('MainMenu');
            this.scene.index = this.scene.indices.back;
            this.scene.back.setColor('#cccf00');
        });
        this.buttons.push(this.back);

        this.timer = this.add.text(205, 220, hours + " : " + minutes + " : " + seconds);

        this.elapsed();
        this.timer.setColor('#000000');
        this.timer.setScale(0.75);

        //this.buttons = [this.items, this.equipment, this.abilities, this.save, this.exit];
        this.input.keyboard.on("keydown", this.onKeyInput, this);
        this.index = 0;

        this.time.addEvent({delay: 1000, callback: this.elapsed, callbackScope: this, repeat: -1});
    },
    onKeyInput: function (event) {
        this.deselectAll();

        if (event.code === "KeyA" && this.index >= 0) {
            this.index--;
        } else if (event.code === "KeyZ" && this.index < this.buttons.length) {
            this.index++;
        } else if (event.code === 'KeyX') {
            console.log("open " + this.index);
            switch (this.index) {
                case this.indices.back:
                    this.scene.switch('MainMenu');
                    break;
                default:
                    console.log('error');
            }

        } else if (event.code === 'Escape') {
            this.scene.switch('MainMenu');
        }

        if (this.index < 0) {
            this.index = this.buttons.length - 1;
        }

        if (this.index >= this.buttons.length) {
            this.index = 0;
        }

        this.buttons[this.index].setColor('#cccf00');
    },
    deselectAll: function () {
        this.buttons.forEach(function (item) {
            item.setColor("#000000");
        });
    },
    elapsed: function () {
        var timeStr = hours + " : " + minutes + " : " + seconds;

        this.timer.setText("Time: " + timeStr);
    }
});

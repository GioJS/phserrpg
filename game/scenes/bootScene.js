var BootScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

        function BootScene() {
            Phaser.Scene.call(this, {key: 'BootScene'});

        },

    preload: function () {
        this.load.image('finger', 'game/assets/finger.png');
        this.cursors = this.input.keyboard.createCursorKeys();
        this.centerX = this.cameras.main.centerX / 2;
        this.centerY = this.cameras.main.centerY / 2;
        this.startX = this.centerX + 20;
        this.startY = this.cameras.main.centerY / 2 + 50;
        this.loadY = this.cameras.main.centerY / 2 + 80;
        this.cursorY = this.cameras.main.centerY / 2 + 60;
        this.cursorStart = this.centerY + 60;
        this.cursorLoad = this.centerY + 90;
    },

    create: function () {
        this.cameras.main.setBackgroundColor("#ffffff");

        var text = this.add.text(this.centerX, this.centerY, "Final Phaser");
        text.setScale(1.5);
        text.setColor("#000000");

        var start = this.add.text(this.startX, this.startY, "New Game");
        start.setScale(1.0);
        start.setColor("#000000");

        var load = this.add.text(this.startX, this.loadY, "Load Game");
        load.setScale(1.0);
        load.setColor("#000000");

        this.cursor = this.physics.add.sprite(this.centerX, this.cursorY, 'finger');

    },
    update: function () {
        if (this.cursors.down.isDown) {
            this.cursor.y = this.cursorLoad;
        }
        if (this.cursors.up.isDown) {
            this.cursor.y = this.cursorStart;
        }

        if (this.cursors.space.isDown) {
            if (this.cursor.y === this.cursorStart) { // start game
                console.log("start");
                this.scene.start('WorldScene');
            } else {
                //load game
                console.log("load screen")
            }


        }
    }


});
var BootScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

        function BootScene ()
        {
            Phaser.Scene.call(this, { key: 'BootScene' });
        },

    preload: function ()
    {
        // load the resources here
        this.load.image('finger', 'game/assets/finger.png');
        this.cursors = this.input.keyboard.createCursorKeys();

    },

    create: function ()
    {
        //this.scene.start('WorldScene');
        this.cameras.main.setBackgroundColor("#ffffff");

        var text = this.add.text(this.cameras.main.centerX/2, this.cameras.main.centerY/2, "Final Phaser");
        text.setScale(1.5);
        text.setColor("#000000");

        var start =  this.add.text(this.cameras.main.centerX/2 + 20, this.cameras.main.centerY/2 + 50, "New Game");
        start.setScale(1.0);
        start.setColor("#000000");

        var load = this.add.text(this.cameras.main.centerX/2 + 20, this.cameras.main.centerY/2 + 80, "Load Game");
        load.setScale(1.0);
        load.setColor("#000000");

        this.cursor = this.physics.add.sprite(this.cameras.main.centerX/2, this.cameras.main.centerY/2 + 60,'finger');

        /*this.physics.world.bounds.width = this.cameras.main.centerX/2 + 20;
        this.physics.world.bounds.height = this.cameras.main.centerY/2 + 80;
        this.cursor.setCollideWorldBounds(true);*/
    },
    update: function () {
        if(this.cursors.down.isDown) {
            this.cursor.y = this.cameras.main.centerY/2 + 90;
        }
        if(this.cursors.up.isDown) {
            this.cursor.y = this.cameras.main.centerY/2 + 60;
        }
    }
    
    
});
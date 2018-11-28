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
    },

    create: function ()
    {
        //this.scene.start('WorldScene');
        var text = this.scene.add.text(this.game.world.centerX, this.game.world.centerY, "Press Enter");
        text.anchor.setTo(0.5);
    }
});
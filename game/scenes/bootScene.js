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
        var text = this.add.text(this.cameras.main.centerX/2, this.cameras.main.centerY, "Final Phaser");
        text.setScale(1.5);
    }
});
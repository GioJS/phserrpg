var WorldScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

        function WorldScene() {
            Phaser.Scene.call(this, {key: 'WorldScene'});
            console.log('created')
        },
    preload: function () {
        this.centerX = this.cameras.main.centerX / 2 - 15;
        this.centerY = this.cameras.main.centerY / 2 + 30;
        console.log('preload')
    },
    create: function () {
        console.log('created')
        // create your world here
        var text = this.add.text(this.centerX, this.centerY, "A long time ago...");
        text.setScale(1.2);
        text.setColor('#ffffff');
    }
});

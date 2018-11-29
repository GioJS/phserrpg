var InitialScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

        function WorldScene() {
            Phaser.Scene.call(this, {key: 'InitialMap'});
        },
    preload: function () {

    },
    create: function () {
        console.log('ok')
    }
});

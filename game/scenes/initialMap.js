var InitialScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

        function WorldScene() {
            Phaser.Scene.call(this, {key: 'InitialMap'});
        },
    preload: function () {
        this.load.image('tiles', 'game/assets/map/spritesheet.png');
        this.load.tilemapTiledJSON('map', 'game/assets/map/map.json');
        this.load.spritesheet('player', 'game/assets/pgsheets.png', { frameWidth: 16, frameHeight: 16 });
        this.cursors = this.input.keyboard.createCursorKeys();
        this.load.image('up', 'game/assets/arrow.png');
        this.load.image('down', 'game/assets/arrow.png');
        this.load.image('left', 'game/assets/arrow.png');
        this.load.image('right', 'game/assets/arrow.png');

    },
    create: function () {
        var map = this.make.tilemap({ key: 'map' });

        var tiles = map.addTilesetImage('spritesheet', 'tiles');

        var grass = map.createStaticLayer('Grass', tiles, 0, 0);
        var obstacles = map.createStaticLayer('Obstacles', tiles, 0, 0);
        obstacles.setCollisionByExclusion([-1]);

        this.player = this.physics.add.sprite(50, 100, 'player', 6);

        this.physics.world.bounds.width = map.widthInPixels;
        this.physics.world.bounds.height = map.heightInPixels;
        this.player.setCollideWorldBounds(true);


        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.roundPixels = true;

        //  animation with key 'left', we don't need left and right as we will use one and flip the sprite
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', { frames: [1, 7, 1, 13]}),
            frameRate: 10,
            repeat: -1
        });

        // animation with key 'right'
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', { frames: [1, 7, 1, 13] }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('player', { frames: [2, 8, 2, 14]}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('player', { frames: [ 0, 6, 0, 12 ] }),
            frameRate: 10,
            repeat: -1
        });

        this.physics.add.collider(this.player, obstacles);


        this.up = this.physics.add.sprite(50, 160, 'up');
        this.up.scaleX = 0.5;
        this.up.scaleY = 0.5;
        this.up.angle = -90;
        this.down = this.physics.add.sprite(50, 200, 'down');
        this.down.scaleX = 0.5;
        this.down.scaleY = 0.5;
        this.down.angle = +90;
        this.left = this.physics.add.sprite(20, 180, 'left');
        this.left.scaleX = 0.5;
        this.left.scaleY = 0.5;
        this.left.angle = -180;
        this.right = this.physics.add.sprite(80, 180, 'right');
        this.right.scaleX = 0.5;
        this.right.scaleY = 0.5;
        this.right.angle = 360;
    },
    update: function(time, delta) {
        this.player.body.setVelocity(0);

        // Horizontal movement
        if (this.cursors.left.isDown)
        {
            this.player.body.setVelocityX(-80);
        }
        else if (this.cursors.right.isDown)
        {
            this.player.body.setVelocityX(80);
        }

        // Vertical movement
        if (this.cursors.up.isDown)
        {
            this.player.body.setVelocityY(-80);
        }
        else if (this.cursors.down.isDown)
        {
            this.player.body.setVelocityY(80);
        }
        //animation
        if (this.cursors.left.isDown)
        {
            this.player.anims.play('left', true);
        }
        else if (this.cursors.right.isDown)
        {
            this.player.anims.play('right', true);
        }
        else if (this.cursors.up.isDown)
        {
            this.player.anims.play('up', true);
        }
        else if (this.cursors.down.isDown)
        {
            this.player.anims.play('down', true);
        }
        else
        {
            this.player.anims.stop();
        }
    }
});

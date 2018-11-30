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


        this.moveUp = false;
        this.moveDown = false;
        this.moveLeft = false;
        this.moveRight = false;

        this.moveUpT = false;
        this.moveDownT = false;
        this.moveLeftT = false;
        this.moveRightT = false;


        this.up = this.add.sprite(50, 160, 'up').setInteractive();
        this.up.scaleX = 0.5;
        this.up.scaleY = 0.5;
        this.up.angle = -90;
        this.up.setScrollFactor(0);
        this.up.on('pointerdown', function(pointer, localX, localY, event){
            this.moveUpT = true;
            this.moveDownT = false;
            this.moveLeftT = false;
            this.moveRightT = false;
        }, this);

        this.up.on('pointerup', function(pointer, localX, localY, event){
            this.moveUpT = false;
        }, this);

        this.down = this.add.sprite(50, 200, 'down').setInteractive();
        this.down.scaleX = 0.5;
        this.down.scaleY = 0.5;
        this.down.angle = +90;

        this.down.setScrollFactor(0);
        this.down.on('pointerdown', function(pointer, localX, localY, event){
            this.moveDownT = true;
            this.moveUpT = false;
            this.moveLeftT = false;
            this.moveRightT = false;
        }, this);

        this.down.on('pointerup', function(pointer, localX, localY, event){
            this.moveDownT = false;
        }, this);

        this.left = this.add.sprite(20, 180, 'left').setInteractive();
        this.left.scaleX = 0.5;
        this.left.scaleY = 0.5;
        this.left.angle = -180;
        this.left.setScrollFactor(0);

        this.left.on('pointerdown', function(pointer, localX, localY, event){
            this.moveLeftT = true;
            this.moveUpT = false;
            this.moveDownT = false;
            this.moveRightT = false;
        }, this);

        this.left.on('pointerup', function(pointer, localX, localY, event){
            this.moveLeftT = false;
        }, this);

        this.right =  this.add.sprite(80, 180, 'right').setInteractive();
        this.right.scaleX = 0.5;
        this.right.scaleY = 0.5;
        this.right.angle = 360;

        this.right.setScrollFactor(0);
        this.right.on('pointerdown', function(pointer, localX, localY, event){
            this.moveRightT = true;
            this.moveUpT = false;
            this.moveDownT = false;
            this.moveLeftT = false;
        }, this);

        this.right.on('pointerup', function(pointer, localX, localY, event){
            this.moveRightT = false;
        }, this);


    },
    update: function(time, delta) {
        this.player.body.setVelocity(0);
        this.moveUp = false;
        this.moveDown = false;
        this.moveLeft = false;
        this.moveRight = false;

        // Horizontal movement
        if (this.cursors.left.isDown)
        {
            this.moveLeft = true;
        }
        else if (this.cursors.right.isDown)
        {
            this.moveRight = true;
        }

        // Vertical movement
        if (this.cursors.up.isDown)
        {
            this.moveUp = true;
        }
        else if (this.cursors.down.isDown)
        {
            this.moveDown = true;
        }
        this.movement();
    },
    movement: function () { //TODO extract to class
        // Horizontal movement
        if (this.moveLeft || this.moveLeftT)
        {
            this.player.body.setVelocityX(-80);
        }
        else if (this.moveRight || this.moveRightT)
        {
            this.player.body.setVelocityX(80);
        }

        // Vertical movement
        if (this.moveUp || this.moveUpT)
        {
            this.player.body.setVelocityY(-80);
        }
        else if (this.moveDown || this.moveDownT)
        {
            this.player.body.setVelocityY(80);
        }
        //animation
        if (this.moveLeft || this.moveLeftT)
        {
            this.player.anims.play('left', true);
        }
        else if (this.moveRight || this.moveRightT)
        {
            this.player.anims.play('right', true);
        }
        else if (this.moveUp || this.moveUpT)
        {
            this.player.anims.play('up', true);
        }
        else if (this.moveDown || this.moveDownT)
        {
            this.player.anims.play('down', true);
        }
        else
        {
            this.player.anims.stop();
        }
    }
});

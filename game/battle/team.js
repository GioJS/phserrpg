var Unit = new Phaser.Class({
    Extends: Phaser.GameObjects.Sprite,

    initialize:

        function Unit(scene, x, y, texture, frame, type, hp, damage) {
            Phaser.GameObjects.Sprite.call(this, scene, x, y, texture, frame)
            this.type = type;
            this.maxHp = this.hp = hp;
            this.damage = damage; // default damage
            this.living = true;
            this.menuItem = null;
        },
    // we will use this to notify the menu item when the unit is dead
    setMenuItem: function(item) {
        this.menuItem = item;
    },
    attack: function(target) {
        if(target.living) {
            var tween = this.scene.tweens.add({
                targets: [this],
                x: target.x + (target.x < this.x ? 20 : -20),
                y: target.y,
                duration: 500,
                ease: 'Quadratic.InOut',
                repeat: 0,
                yoyo: true,
                onComplete: function () {
                    target.takeDamage(this.damage);
                    this.scene.events.emit("Message", this.type + " attacks " + target.type + " for " + this.damage + " damage");
                },
                onCompleteScope: this
            });
        }
    },
    takeDamage: function(damage) {
        this.hp -= damage;
        if(this.hp <= 0) {
            this.hp = 0;
            this.menuItem.unitKilled();
            this.living = false;
            if(this instanceof  PlayerCharacter){
                this.angle = 90;
            }

            if(this instanceof  Enemy){

                this.scene.tweens.add({
                    targets: [this],
                    alpha: 0,
                    duration: 2000,
                    ease: 'Linear.None',
                    repeat: 0,
                    yoyo: false,
                    onComplete: function () {
                        this.destroy();
                    },
                    onCompleteScope: this
                });
            }


            this.menuItem = null;
        }
    }
});


var PlayerCharacter = new Phaser.Class({
    Extends: Unit,

    initialize:
        function PlayerCharacter(scene, x, y, texture, frame, type, hp, damage) {
            Unit.call(this, scene, x, y, texture, frame, type, hp, damage);
            // flip the image so I don't have to edit it manually
            this.flipX = true;

            this.setScale(2);
        }
});
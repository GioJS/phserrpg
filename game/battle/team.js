var Unit = new Phaser.Class({
    Extends: Phaser.GameObjects.Sprite,

    initialize:

        function Unit(scene, x, y, texture, frame, type, hp, damage) {
            Phaser.GameObjects.Sprite.call(this, scene, x, y, texture, frame)
            this.type = type;
            this.maxHp = this.hp = hp;
            this.damage = damage; // default damage
        },
    attack: function(target) {
        var tween = this.scene.tweens.add({
            targets: [this],
            x: target.x - 20,
            duration: 700,
            ease: 'Quadratic.InOut',
            repeat: 0,
            yoyo: true,
            onComplete: function () {
                target.takeDamage(this.damage);
                this.scene.events.emit("Message", this.type + " attacks " + target.type + " for " + this.damage + " damage");
            },
            onCompleteScope: this
        });

    },
    takeDamage: function(damage) {
        this.hp -= damage;
        if(this.hp <= 0) {
            this.hp = 0;
            this.alive = false;
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
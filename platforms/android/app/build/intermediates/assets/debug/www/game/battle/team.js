var Unit = new Phaser.Class({
    Extends: Phaser.GameObjects.Sprite,

    initialize:

        function Unit(scene, x, y, texture, frame, type, hp, damage, critProb, defence, critDamage) {
            Phaser.GameObjects.Sprite.call(this, scene, x, y, texture, frame);
            this.type = type;
            this.maxHp = this.hp = hp;
            this.damage = damage; // default damage
            this.living = true;
            this.menuItem = null;
            this.textItem = null;
            this.critProb = critProb;
            this.defence = defence;
            this.critDamage = critDamage;
        },
    // we will use this to notify the menu item when the unit is dead
    setMenuItem: function (item) {
        this.menuItem = item;
    },
    setTextItem: function (item) {
        this.textItem = item;
    },
    attack: function (target) {
        if (target.living) {
            var tween = this.scene.tweens.add({
                targets: [this],
                x: target.x + (target.x < this.x ? 20 : -20),
                y: target.y,
                duration: 500,
                ease: 'Quadratic.InOut',
                repeat: 0,
                yoyo: true,
                onComplete: function () {
                    var crit = Math.random() >= this.critProb;
                    console.log(target);
                    var damage;
                    if((this.damage + this.critDamage) <= target.defence)
                        damage = 0;
                    else
                        damage = this.damage - target.defence + (crit ? this.critDamage : 0);
                    target.takeDamage(damage);
                    this.scene.events.emit("Message", this.type + (crit ? ' critical' : '') + " attacks " + target.type + " for " + damage + " damage");
                },
                onCompleteScope: this
            });
        }
    },
    takeDamage: function (damage) {
        this.hp -= damage;
        if (this.hp <= 0) {
            this.hp = 0;
            this.menuItem.unitKilled();
            this.living = false;
            if (this instanceof PlayerCharacter) {
                this.angle = 90;
            }

            if (this instanceof Enemy) {

                this.scene.tweens.add({
                    targets: [this],
                    alpha: 0,
                    duration: 2000,
                    ease: 'Linear.None',
                    repeat: 0,
                    yoyo: false,
                    onComplete: function () {
                        //this.destroy();
                        this.visible = false;
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
        function PlayerCharacter(scene, x, y, texture, frame, type, hp, damage, critProb, defence, critDamage) {
            Unit.call(this, scene, x, y, texture, frame, type, hp, damage, critProb, defence, critDamage);
            // flip the image so I don't have to edit it manually
            this.flipX = true;

            this.setScale(2);
        }
});
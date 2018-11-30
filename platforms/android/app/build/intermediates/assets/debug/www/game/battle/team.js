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
        target.takeDamage(this.damage);
    },
    takeDamage: function(damage) {
        this.hp -= damage;
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
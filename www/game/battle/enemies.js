var Enemy = new Phaser.Class({
    Extends: Unit,

    initialize:
        function Enemy(scene, x, y, texture, frame, type, hp, damage, critProb, defence, critDamage) {
            Unit.call(this, scene, x, y, texture, frame, type, hp, damage, critProb, defence, critDamage);
        }
});
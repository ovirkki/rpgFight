var _ = require("underscore");

var DEFAULTS = {
    might: 5,
    agility: 5,
    stamina: 5
};

function Character(attributes) {
    if(!attributes) {
        this.attributes = generateRandomAttributes();
    }
    this.coordinates = {};
    this.inventory = {
        using: {
            weapon: undefined,
            armor: undefined
        },
        backpack: []
    };
    this.hitPoints = {
        max: this.attributes.stamina * 4,
        current: this.attributes.stamina * 4
    };
}

function generateRandomAttributes() {
    return {
        might: _.random(3,6),//DEFAULTS.might,
        agility: _.random(3,6),
        stamina: _.random(3,6)
    };
}

Character.prototype.getAttribute = function(attributeAsString) {
    return this.attributes[attributeAsString];
};

Character.prototype.addToInventory = function(object) {
    _.extend(this.inventory, object);
};

Character.prototype.updateCoordinates = function(x, y) {
    this.coordinates.x = x;
    this.coordinates.y = y;
};

Character.prototype.getCurrentCoordinates = function() {
    return this.coordinates;
};

Character.prototype.setNewCoordinates = function(newCoordinates) {
    this.coordinates = newCoordinates;
};

Character.prototype.moveCharacterTo = function() {
    //return hitChance + damage
};

Character.prototype.reduceHitPoints = function(amount) {
    this.hitPoints.current -= amount;
};

Character.prototype.isDead = function() {
    return this.hitPoints.current <= 0;
};

module.exports = Character;
//module.exports.addToInventory = Character.prototype.addToInventory;
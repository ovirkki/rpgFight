var _ = require("underscore");

var DEFAULTS = {
    might: 5,
    agility: 5,
    stamina: 5
};

function Character(attributes) {
    if(!attributes) {
        this.attributes = {
            might: DEFAULTS.might,
            agility: DEFAULTS.agility,
            stamina: DEFAULTS.stamina
        };
    }
    this.coordinates = {};
    this.inventory = {};
}

Character.prototype.addToInventory = function(object) {
    _.extend(this.inventory, object);
};

Character.prototype.updateCoordinates = function(x, y) {
    this.coordinates.x = x;
    this.coordinates.y = y;
};

Character.prototype.incomingAttack = function(hitChance, damage) {
    //deflect vs. hitChance
    //damage reduction damage - armor
    // return miss/hit with X damage
};

Character.prototype.makeAttack = function(weapon) {
    //return hitChance + damage
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

module.exports = Character;
//module.exports.addToInventory = Character.prototype.addToInventory;
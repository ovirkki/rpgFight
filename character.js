var _ = require("underscore");
var eventHandler = require("./eventHandler");
var constants = require("./constants");

var DEFAULTS = {
    might: 5,
    agility: 5,
    stamina: 5
};

function Character(id, attributes) {
    if(!attributes) {
        this.attributes = generateRandomAttributes();
    }
    this.id = id;
    this.coordinates = {};
    this.inventory = {
        using: {
            weapon: constants.weapon.PISTOL,
            armor: undefined
        },
        backpack: []
    };
    this.movementRange = 1;
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

Character.prototype.getDistanceTo = function(targetCoordinates) {
    var currentCoordinates = this.getCurrentCoordinates();
    var xOffset = Math.abs(currentCoordinates.x - targetCoordinates.x);
    var yOffset = Math.abs(currentCoordinates.y - targetCoordinates.y);
    return xOffset + yOffset;
};

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

Character.prototype.moveCharacterTo = function(targetCoordinates) {
    if(this.getDistanceTo(targetCoordinates) <= this.movementRange) {
        eventHandler.makeMoveEvent(this, this.getCurrentCoordinates(), targetCoordinates);
        this.setNewCoordinates(targetCoordinates);
    } else {
        eventHandler.logEvent("Cannot move, out of range");
    }
};

Character.prototype.reduceHitPoints = function(amount) {
    this.hitPoints.current -= amount;
    eventHandler.emitCharacterEvent(constants.characterOperation.GETDAMAGE, this, {
        amount: amount,
        currentHitpoints: this.hitPoints.current
    });
};

Character.prototype.isDead = function() {
    console.log("IS DEAD? " + this.id +  ", HPs: " + this.hitPoints.current);
    return this.hitPoints.current <= 0;
};

module.exports = Character;
//module.exports.addToInventory = Character.prototype.addToInventory;
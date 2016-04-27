var _ = require("underscore");
var uiController = require("./uiController");
var eventHandler = require("./eventHandler");
var logEvent = require("./eventHandler").logEvent;
var constants = require("./constants");

function calculateHitChance(attacker, targetCharacter) {
    return (attacker.getAttribute("agility") / 2) / targetCharacter.getAttribute("agility");
}

function isHit(hitChance) {
    var hitRandom = _.random(100); //0-100%
    var hitPercent = hitChance * 100;
    logEvent("Needed for hit: " + hitRandom + ", got: " + hitPercent);
    return hitPercent >= hitRandom;
}

function calculateDamage() {
    return 5;
}

function isWithinRange(character, targetDistance) {
    console.log("char: " + JSON.stringify(character));
    var weaponRange = character.inventory.using.weapon.range;
    console.log("isWithinRange, weaponRange: " + weaponRange + ", dist: " + targetDistance);
    return weaponRange >= targetDistance;
}

function makeAttack(attacker, targetCharacter) {
    if(attacker.getDistanceTo(targetCharacter.coordinates) <= attacker.inventory.using.weapon.range) {
        var hitChance = calculateHitChance(attacker, targetCharacter);
        eventHandler.emitCharacterEvent(constants.characterOperation.ATTACK, attacker);
        if(isHit(hitChance)) {
            var damage = calculateDamage();
            logEvent("Hit enemy with " + damage + " damage!");
            targetCharacter.reduceHitPoints(damage);
            if (targetCharacter.isDead()) {
                logEvent("Enemy KILL!!!!");
            }
        } else {
            logEvent("MISS");
        }
    } else {
        logEvent("Out of range");
    }

}

module.exports.makeAttack = makeAttack;
module.exports.isWithinRange = isWithinRange;
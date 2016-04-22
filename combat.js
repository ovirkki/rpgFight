var _ = require("underscore");
var uiController = require("./uiController");
var logEvent = require("./eventHandler").logEvent;

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

function makeAttack(attacker, targetCharacter) {
    //return hitChance + damage
    console.log("Attack!");
    var hitChance = calculateHitChance(attacker, targetCharacter);
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
    //console.log("Attacker: " + JSON.stringify(attacker));
    //console.log("Target: " + JSON.stringify(targetCharacter));
}

module.exports.makeAttack = makeAttack;
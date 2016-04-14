var Promise = require("bluebird");
var gameHandler = require("./gameHandler");
var inputController = require("./inputController");


var SMALL = {
    x: 10,
    y: 10,
    enemies: 2
};

function initializeEnemies() {
    console.log("Add enemies to world");
}

function startGame() {
    console.log("Starting game");
    return inputController.startListening();
}

function initializeGame() {

    gameHandler.generateWorld(SMALL)
    .then(function() {
        console.log("Game started");
        return startGame();
    })
    .then(function() {
        console.log("Game ended");
    /*})
    .catch(function(err) {
        console.log("Game failed: ");
        console.log(err);*/
    });

}


initializeGame();
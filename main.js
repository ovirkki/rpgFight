var Promise = require("bluebird");
var gameHandler = require("./gameHandler");
var inputController = require("./inputController");
var uiController = require("./uiController");
var eventHandler = require("./eventHandler");
var logEvent = require("./eventHandler").logEvent;
var server = require("./server");

function startGame() {
    logEvent("Starting game");
    return inputController.startListening();
}

function initializeGame() {
    eventHandler.initialize();
    uiController.initialize();
    //server.initialize();
    //startGame();
    server.startServerAndWaitForGameEvents()
    /*.then(function() {
        logEvent("Game started");
        return startGame();
    })*/
    .then(function(doneReason) {
        logEvent("Game ended: " + doneReason);
        process.exit(); //To ensure that server not listening anymore as server.close() does not really close the server
    /*})
    .catch(function(err) {
        console.log("Game failed: ");
        console.log(err);*/
    });

}

initializeGame();
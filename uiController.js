var eventHandler = require("./eventHandler");
var server = require("./server");

function initialize() {
    eventHandler.logStream.onValue(function(logData) {
        console.log("EVENT LOG: " + logData);
        server.sendLog(logData);
    });
    eventHandler.gameEventStream.onValue(function(eventData) {
        console.log("ui contr, sendEvent: " + eventData);
        server.sendEvent(eventData);
    });
}

function getGameWorldAsAscii(gameWorld) {
    var totalString = "";
    gameWorld.board.forEach(function(row) {
        var rowString = "|";
        row.forEach(function(tile) {
            if (!tile.occupant) {
                rowString += " ";
            } else if (!tile.occupant.isDead()) {
                rowString += "X";
            } else {
                rowString += "D";
            }
/*
            } else if (tile.occupant === "enemy") {
                rowString = rowString + "E";
            } else if (tile.occupant === "player") {
                rowString = rowString + "X";
            }
*/
            rowString += "|";
        });
        totalString += rowString + "\n";//console.log(rowString);
    });
    return totalString;
    //console.log("Occupant 0, 0: " + JSON.stringify(gameWorld.board[0][0].occupant));
    //console.log("First char on list: " + JSON.stringify(gameWorld.characters[0]));
}

function printGameWorld(gameWorld) {
    console.log(getGameWorldAsAscii(gameWorld));
    eventHandler.logEvent(getGameWorldAsAscii(gameWorld));
}

function printCharacters(gameWorld) {
    gameWorld.characters.forEach(function(character) {
        console.log(character);
    });
}

module.exports.initialize = initialize;
module.exports.printGameWorld = printGameWorld;
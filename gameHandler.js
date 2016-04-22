var _ = require("underscore");
var Promise = require("bluebird");
var uiController = require("./uiController");
var eventHandler = require("./eventHandler");
var emitGameEvent = require("./eventHandler").emitGameEvent;
var logEvent = require("./eventHandler").logEvent;
var Character = require("./character");
var combat = require("./combat");
var gameWorld = {};
var constants = require("./constants");
var events = require("events");
var Bacon = require("baconjs").Bacon;

function initBoard(gameSize) {
    var widthHelperArray = _.range(gameSize.x);
    var heightHelperArray = _.range(gameSize.y);
    gameWorld.board = heightHelperArray.map(function(y) {
        return widthHelperArray.map(function(x) {
            return {
                coordinates: {
                    x: x,
                    y: y
                },
                occupant: undefined
            };
        });
    });

    return Promise.resolve();
}

function updateBoard(coordinates, operation, character) {
    if(operation === constants.tileUpdateOperation.ADD) {
        //gameEventEmitter.emit(constants.eventStreams.GAMEEVENT, eventString);
        gameWorld.board[coordinates.y][coordinates.x].occupant = character;
    } else if(operation === constants.tileUpdateOperation.CLEAR) {
        gameWorld.board[coordinates.y][coordinates.x].occupant = undefined;
    } else if(operation === constants.tileUpdateOperation.DIE) {

    }
}

function initCharacters(gameSize) {
    gameWorld.characters = [];
    var player = new Character();
    player.updateCoordinates(0, 0);
    gameWorld.board[0][0].occupant = player;
    gameWorld.characters.push(player);
    _.range(gameSize.enemies).forEach(function(id) {
        var xCoordinate = _.random(gameSize.x-1);
        var yCoordinate = _.random(gameSize.y-1);
        var enemy = new Character();
        enemy.updateCoordinates(xCoordinate, yCoordinate);
        gameWorld.characters.push(enemy);
        gameWorld.board[yCoordinate][xCoordinate].occupant = enemy;
    });
}

function generateWorld(gameSize) {
    logEvent("Game world generation");
    return initBoard(gameSize)
    .then(function(board) {
        initCharacters(gameSize);

        uiController.printGameWorld(gameWorld);
        //console.log(JSON.stringify(gameWorld.board));
    })
    .then(function() {
        uiController.printGameWorld(gameWorld);
    });
}

function isMoveAllowed(newCoordinates) {
    return newCoordinates.x >= 0 && newCoordinates.y < gameWorld.board.length &&
        newCoordinates.y >= 0 && newCoordinates.x < gameWorld.board[newCoordinates.y].length;
}

function isOccupiedByAliveEnemy(newCoordinates) {
    return gameWorld.board[newCoordinates.y][newCoordinates.x].occupant !== undefined &&
        !gameWorld.board[newCoordinates.y][newCoordinates.x].occupant.isDead();
}

function movePlayerTo(relativeX, relativeY) {
    moveCharacterTo(gameWorld.characters[0], relativeX, relativeY);
}

function moveCharacterTo(character, relativeX, relativeY) {
    var oldCoordinates = character.getCurrentCoordinates();
    var newCoordinates = {
        x: oldCoordinates.x + relativeX,
        y: oldCoordinates.y + relativeY
    };

    if (isMoveAllowed(newCoordinates)) {
        if (isOccupiedByAliveEnemy(newCoordinates)) {
            console.log("Enemy occupied!");
            combat.makeAttack(character, gameWorld.board[newCoordinates.y][newCoordinates.x].occupant);
        } else {
            character.setNewCoordinates(newCoordinates);
            emitGameEvent("characterEvent", {
                coordinates: oldCoordinates,
                tileOperation: constants.tileUpdateOperation.CLEAR
            });
            emitGameEvent("characterEvent", {
                coordinates: newCoordinates,
                tileOperation: constants.tileUpdateOperation.ADD,
                character: character
            });
            //gameWorld.board[oldCoordinates.y][oldCoordinates.x].occupant = undefined;
            //gameWorld.board[newCoordinates.y][newCoordinates.x].occupant = character;
            logEvent("Character moved to coordinates: x: " + newCoordinates.x + ", y: " + newCoordinates.y);
        }
    } else {
        logEvent("Tried to move to blocked coordinate: x: " + newCoordinates.x + ", y: " + newCoordinates.y);
    }
}

function startNewGame(gameSize) {
    if(!gameSize) {
        gameSize = constants.gameSize.SMALL;
    }
    eventHandler.gameEventStream.onValue(function(eventData) {
        updateBoard(eventData.coordinates, eventData.operation, eventData.character);
        uiController.printGameWorld(gameWorld);
    });
    generateWorld(gameSize)
    .then(function() {
        emitGameEvent("gameInit", gameWorld);
    });
}

function startTurnLoop() {
    function waitForTurnEvent() {
        //return Promise.reject if game ends?
        return Promise.resolve();
    }

    function nextTurn(turn) {
        return waitForTurnEvent(getNextCharacter(turn))
        .then(function() {
            nextTurn(turn++);
        });
    }
    return nextTurn(0)
    .catch(function(error) {
        console.log("turn loop ended");
    });
}

function getCharacterBySocketId(socketId) {
    return gameWorld.characters[0];
}

module.exports.generateWorld = generateWorld;
module.exports.movePlayerTo = movePlayerTo;
module.exports.startNewGame = startNewGame;
module.exports.getCharacterBySocketId = getCharacterBySocketId;
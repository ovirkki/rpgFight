var _ = require("underscore");
var Promise = require("bluebird");
var uiController = require("./uiController");
var eventHandler = require("./eventHandler");
var emitCharacterEvent = require("./eventHandler").emitCharacterEvent;
var emitGameEvent = require("./eventHandler").emitGameEvent;
var logEvent = require("./eventHandler").logEvent;
var Character = require("./character");
var combat = require("./combat");
var gameWorld = {};
var constants = require("./constants");
var events = require("events");
var Bacon = require("baconjs").Bacon;
var Board = require("./gameBoard");

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
    if(operation === constants.tileUpdateOperation.CHARACTER) {
        //gameEventEmitter.emit(constants.eventStreams.GAMEEVENT, eventString);
        gameWorld.board[coordinates.y][coordinates.x].occupant = character;
    } else if(operation === constants.tileUpdateOperation.CLEAR) {
        gameWorld.board[coordinates.y][coordinates.x].occupant = undefined;
    } else if(operation === constants.tileUpdateOperation.DIE) {

    }
}

function initCharacters(gameSize) {
    gameWorld.characters = [];
    _.range(gameSize.players).forEach(function(id) {
        var xCoordinate = _.random(gameSize.x-1);
        var yCoordinate = _.random(gameSize.y-1);
        var newPlayer = new Character(id);
        newPlayer.updateCoordinates(xCoordinate, yCoordinate);
        gameWorld.characters.push(newPlayer);
        gameWorld.board.tiles[yCoordinate][xCoordinate].occupant = newPlayer;
    });
}

function generateWorld(gameSize) {
    logEvent("Game world generation");
    return initBoard(gameSize)
    .then(function(board) {
        gameWorld.board = new Board(gameSize);
    })
    .then(function() {
        initCharacters(gameSize);
    })
    .then(function() {
        uiController.printGameWorld(gameWorld);
    });
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

    if (gameWorld.board.isMoveAllowed(newCoordinates)) {
        if (gameWorld.board.isOccupiedByAliveEnemy(character, newCoordinates)) {
            eventHandler.makeAttackEvent(character, newCoordinates);
            combat.makeAttack(character, gameWorld.board.tiles[newCoordinates.y][newCoordinates.x].occupant);
        } else {
            character.setNewCoordinates(newCoordinates);
            eventHandler.makeMoveEvent(character, oldCoordinates, newCoordinates);
            logEvent("Character moved to coordinates: x: " + newCoordinates.x + ", y: " + newCoordinates.y);
        }
    } else {
        logEvent("Tried to move to blocked coordinate: x: " + newCoordinates.x + ", y: " + newCoordinates.y);
    }
}

function handleGeneralAction(character, coordinates) {
    uiController.printGameWorld(gameWorld);
    var targetDistance = gameWorld.board.calculateDistance(character.getCurrentCoordinates(), coordinates);
    if(targetDistance === 0) return;

    if(gameWorld.board.isOccupiedByAliveEnemy(character, coordinates)) {
        console.log("Attack");
        combat.makeAttack(character, gameWorld.board.tiles[coordinates.y][coordinates.x].occupant, targetDistance);
    } else {
        console.log("Move");
        if (gameWorld.board.isMoveAllowed(coordinates)) {
            character.moveCharacterTo(coordinates);
        }
    }
}

function startNewGame(gameSize) {
    if(!gameSize) {
        gameSize = constants.gameSize.SMALL;
    }
    /*eventHandler.gameEventStream.onValue(function(eventData) {
        updateBoard(eventData.coordinates, eventData.operation, eventData.character);
        uiController.printGameWorld(gameWorld);
    });*/
    generateWorld(gameSize)
    .then(function() {
        emitGameEvent("gameInit", gameWorld);
        return startTurnLoop();
    });

}

function getActiveCharacter() {
    console.log("act char: " + JSON.stringify(getCharacterForTurn(gameWorld.ongoingTurn)));
    return getCharacterForTurn(gameWorld.ongoingTurn);
}

function getCharacterForTurn(turn) {
    var characterIndex = turn % gameWorld.characters.length;
    return gameWorld.characters[characterIndex];
}

function startTurnLoop() {
    var characterEndTurnOperations = [constants.characterOperation.MOVE, constants.characterOperation.ATTACK];
    function waitForTurnEvent(character) {
        return new Promise(function(resolve, reject) {
            if(character.isDead()) {
                resolve();
            } else {
                eventHandler.characterEventStream
                .filter(function(event) {
                    return event.character.id === character.id;
                })
                .filter(function(event) {
                    return characterEndTurnOperations.some(function(operation) {
                        return event.operation === operation;
                    });
                })
                .onValue(function() {
                    resolve();
                });
            }
        });
    }

    function nextTurn(turn) {
        gameWorld.ongoingTurn = turn;
        eventHandler.emitGameEvent(constants.gameOperation.NEXTTURN, {characterId: getCharacterForTurn(turn).id});
        return waitForTurnEvent(getCharacterForTurn(turn))
        .then(function() {
            return nextTurn(++turn);
        });
    }
    return nextTurn(0)
    .catch(function(error) {
        console.log("turn loop ended due error: " + error);
    });
}

function getCharacterBySocketId(socketId) {
    return gameWorld.characters[0];
}

module.exports.generateWorld = generateWorld;
module.exports.moveCharacterTo = moveCharacterTo;
module.exports.startNewGame = startNewGame;
module.exports.getCharacterBySocketId = getCharacterBySocketId;
module.exports.getActiveCharacter = getActiveCharacter;
module.exports.handleGeneralAction = handleGeneralAction;
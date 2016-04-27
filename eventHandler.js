var events = require("events");
var Bacon = require("baconjs").Bacon;
var constants = require("./constants");
var logEmitter, characterEventEmitter, inputEmitter, environmentEventEmitter;

function initialize() {
    logEmitter = new events.EventEmitter();
    module.exports.logStream = Bacon.fromEvent(logEmitter, constants.eventStreams.LOGGING);

    characterEventEmitter = new events.EventEmitter();
    module.exports.characterEventStream = Bacon.fromEvent(characterEventEmitter, constants.eventStreams.CHARACTEREVENT);

    inputEmitter = new events.EventEmitter();
    module.exports.inputStream = Bacon.fromEvent(inputEmitter, constants.eventStreams.INPUT);

    gameEventEmitter = new events.EventEmitter();
    module.exports.gameEventStream = Bacon.fromEvent(gameEventEmitter, constants.eventStreams.GAMEEVENT);
}

function logEvent(eventString) {
    logEmitter.emit(constants.eventStreams.LOGGING, eventString);
}

function emitCharacterEvent(operation, character, updateData) {
    characterEventEmitter.emit(constants.eventStreams.CHARACTEREVENT, {
        operation: operation,
        character: character,
        eventData: updateData
    });
}

function emitGameEvent(operation, data) {
    gameEventEmitter.emit(constants.eventStreams.GAMEEVENT, {
        operation: operation,
        eventData: data
    });
}

function newInput(inputObject) {
    inputEmitter.emit(constants.eventStreams.INPUT, inputObject);
}

function makeMoveEvent(character, oldCoordinates, newCoordinates) {
    emitCharacterEvent(constants.characterOperation.MOVE, character, {
        coordinates: newCoordinates,
        data: {
            oldCoordinates: oldCoordinates
        }
    });
}

function makeAttackEvent(character, targetCoordinates) {
/*
    emitCharacterEvent("characterEvent", {
        coordinates: oldCoordinates,
        tileOperation: constants.tileUpdateOperation.CLEAR
    });
*/
    emitCharacterEvent(constants.characterOperation.ATTACK, {
        character: character,
        coordinates: targetCoordinates,
    });
}

module.exports.initialize = initialize;
module.exports.logEvent = logEvent;
module.exports.emitCharacterEvent = emitCharacterEvent;
module.exports.emitGameEvent = emitGameEvent;
module.exports.newInput = newInput;
module.exports.makeMoveEvent = makeMoveEvent;
module.exports.makeAttackEvent = makeAttackEvent;
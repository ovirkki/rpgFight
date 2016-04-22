var events = require("events");
var Bacon = require("baconjs").Bacon;
var constants = require("./constants");
var logEmitter, gameEventEmitter, inputEmitter;

function initialize() {
    logEmitter = new events.EventEmitter();
    module.exports.logStream = Bacon.fromEvent(logEmitter, constants.eventStreams.LOGGING);

    gameEventEmitter = new events.EventEmitter();
    module.exports.gameEventStream = Bacon.fromEvent(gameEventEmitter, constants.eventStreams.GAMEEVENT);

    inputEmitter = new events.EventEmitter();
    module.exports.inputStream = Bacon.fromEvent(inputEmitter, constants.eventStreams.INPUT);
}

function logEvent(eventString) {
    logEmitter.emit(constants.eventStreams.LOGGING, eventString);
}

function emitGameEvent(operation, updateData) {
    gameEventEmitter.emit(constants.eventStreams.GAMEEVENT, {
        operation: operation,
        changedData: updateData
        /*changedData: {
            coordinates: coordinates,
            tileOperation: tileOperation,
            character: character
        }*/

    });
}

function newInput(inputObject) {
    inputEmitter.emit(constants.eventStreams.INPUT, inputObject);
}

module.exports.initialize = initialize;
module.exports.logEvent = logEvent;
module.exports.emitGameEvent = emitGameEvent;
module.exports.newInput = newInput;
var gameHandler = require("./gameHandler");
var Bacon = require("baconjs").Bacon;
var events = require("events");
var constants = require("./constants");
var eventHandler = require("./eventHandler");

var ATTACKTYPE = {
    MELEE: "melee",
    RANGED: "ranged"
};

var DIRECTION_FUNCTION = {
    LEFT: moveLeft,
    RIGHT: moveRight,
    UP: moveUp,
    DOWN: moveDown
};

var ATTACK = {
    MELEE: undefined
};

var keyMap = {
    a: DIRECTION_FUNCTION.LEFT,
    d: DIRECTION_FUNCTION.RIGHT,
    w: DIRECTION_FUNCTION.UP,
    s: DIRECTION_FUNCTION.DOWN,
    e: ATTACK.MELEE,
    "left": DIRECTION_FUNCTION.LEFT,
    "right": DIRECTION_FUNCTION.RIGHT,
    "up": DIRECTION_FUNCTION.UP,
    "down": DIRECTION_FUNCTION.DOWN,
};

function handleDirection(key) {
    console.log("handleDirection: " + key);
    if(keyMap[key]) {
        keyMap[key]();
    }
}

function moveLeft() {
    gameHandler.movePlayerTo(-1, 0);
}

function moveRight() {
    gameHandler.movePlayerTo(1, 0);
}

function moveUp() {
    gameHandler.movePlayerTo(0, -1);
}

function moveDown() {
    gameHandler.movePlayerTo(0, 1);
}

function parseInputData(inputData) {
    console.log("Need to parse input data: " + JSON.stringify(inputData));
    if(inputData.action && inputData.action.operation === "move") {
        handleDirection(inputData.action.data.direction);
    }
    /*
    Parse inputData: if move, is it allowed etc.
    If valid action, emit it to gameEvent stream
    */
}

function startListening() {
    console.log("initialize inputHandler");
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdin.setRawMode( true );
    //var util = require('util');

    return new Promise(function(resolve) {

        process.stdin.on('data', function (key) {
          //console.log('received data:', util.inspect(text));
          console.log('received key:', key);
          handleDirection(key);
          if (key === 'q' || (key.ctrl && key === "c")) {
            process.stdin.pause();
            resolve();
            process.exit();
          }
        });
    });
}

function initialize() {
    eventHandler.inputStream.onValue(parseInputData);
    //startListening();
}

module.exports.initialize = initialize;
module.exports.startListening = startListening;
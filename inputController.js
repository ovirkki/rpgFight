var gameHandler = require("./gameHandler");

var DIRECTION_FUNCTION = {
    LEFT: moveLeft,
    RIGHT: moveRight,
    UP: moveUp,
    DOWN: moveDown
};

var keyMap = {
    a: DIRECTION_FUNCTION.LEFT,
    d: DIRECTION_FUNCTION.RIGHT,
    w: DIRECTION_FUNCTION.UP,
    s: DIRECTION_FUNCTION.DOWN
};

function handleDirection(key) {
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
          }
        });
    });
}

module.exports.startListening = startListening;
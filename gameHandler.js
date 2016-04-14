var _ = require("underscore");
var Promise = require("bluebird");
var uiController = require("./uiController");
var Character = require("./character");
var gameWorld = {};

function initBoard(gameSize) {
    var widthHelperArray = _.range(gameSize.x);
    var heightHelperArray = _.range(gameSize.y);
    gameWorld.board = widthHelperArray.map(function(x) {
        return heightHelperArray.map(function(y) {
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
    console.log("Game world generation");
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
        newCoordinates.y >= 0 && newCoordinates.x < gameWorld.board[newCoordinates.y].length &&
        gameWorld.board[newCoordinates.y][newCoordinates.x].occupant === undefined;
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

    if(isMoveAllowed(newCoordinates)) {
        character.setNewCoordinates(newCoordinates);
        gameWorld.board[oldCoordinates.y][oldCoordinates.x].occupant = undefined;
        gameWorld.board[newCoordinates.y][newCoordinates.x].occupant = character;
    } else {
        console.log("Move not allowed!");
    }
    uiController.printGameWorld(gameWorld);
}

module.exports.generateWorld = generateWorld;
module.exports.movePlayerTo = movePlayerTo;